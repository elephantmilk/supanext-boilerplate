"use client";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supaBrowser } from "@/lib/supabase/browser";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem as MenuItem,
  DropdownMenuLabel as MenuLabel,
  DropdownMenuSeparator as MenuSeparator,
  DropdownMenuGroup as MenuGroup,
} from "./ui/dropdown-menu";
import { SECURE_DIRECTORIES } from "@/lib/constants";
import { toast } from "sonner";
import revalidate from "@/lib/dal/revalidate";

const HeaderProfile = ({ id, profile }) => {
  const profileData = profile?.data || {};
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const supabase = supaBrowser();
      await revalidate("profile");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Fehler beim Ausloggen:", error.message);
        return;
      }

      toast.success("Erfolgreich ausgeloggt");
      router.refresh();
      
      if (SECURE_DIRECTORIES.includes(pathname)) {
        router.replace("/auth?next=" + pathname);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Fehler beim Ausloggen');
    }
  };

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-0">
        <Avatar className="animate-pop-in">
          {profileData.full_name && (
            <AvatarFallback className="bg-primary">
              {profileData.full_name[0].toUpperCase() || "U"}
            </AvatarFallback>
          )}
          <AvatarImage src={profileData.avatar_url} className="animate-pop-in" />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        collisionPadding={{ top: 20, right: 10 }}>
        <MenuLabel>Mein Konto</MenuLabel>
        <MenuSeparator />
        
        <MenuGroup>
          <MenuItem asChild>
            <Link href="/account">Profil</Link>
          </MenuItem>
        </MenuGroup>

        <MenuSeparator />

        <MenuItem className="justify-center">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleLogout}>
            Abmelden
          </Button>
        </MenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderProfile;
