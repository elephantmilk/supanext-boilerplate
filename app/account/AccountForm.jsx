"use client";
import { supaClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AccountForm() {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);

  // Profildaten aus Supabase laden
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supaClient.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      // Profildaten laden
      const { data, error } = await supaClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data || {});

    } catch (error) {
      console.error('Fehler beim Laden:', error);
      toast.error('Profil konnte nicht geladen werden');
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Bitte nur Bilder hochladen');
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Avatar Fehler:', error);
      toast.error('Fehler beim Avatar-Upload');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supaClient.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      // Avatar hochladen wenn vorhanden
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supaClient.storage
          .from('avatars')
          .upload(filePath, avatar);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supaClient.storage
          .from('avatars')
          .getPublicUrl(filePath);

        profile.avatar_url = publicUrl;
      }

      // Profil aktualisieren
      const { error } = await supaClient
        .from('profiles')
        .upsert({
          ...profile,
          id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Profil aktualisiert!');
      
    } catch (error) {
      console.error('Update Fehler:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Lade...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{profile.full_name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatar-upload"
          />
          <Label 
            htmlFor="avatar-upload" 
            className="cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Avatar ändern
          </Label>
        </div>
      </div>

      {/* Dynamische Profilfelder */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(profile)
          .filter(([key]) => !['id', 'created_at', 'updated_at', 'avatar_url'].includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Label>
              <Input
                id={key}
                name={key}
                value={value || ''}
                onChange={handleChange}
                disabled={key === 'username'} // Username ist read-only
                type={key === 'email' ? 'email' : key === 'website' ? 'url' : 'text'}
                className={key === 'username' ? 'bg-gray-100' : ''}
              />
              {key === 'username' && (
                <span className="text-sm text-gray-500">Automatisch generiert</span>
              )}
            </div>
          ))}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Wird gespeichert...' : 'Profil aktualisieren'}
      </Button>
    </form>
  );
}
