import { supaServer } from "@/lib/supabase/server";
import revalidate from "./revalidate";

export async function getProfile(userId) {
  if (!userId) return { data: null };

  try {
    const supabase = supaServer();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data };
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { error };
  }
}

export async function updateProfile(id, data) {
  const res = await fetch(`${HOSTNAME}/api/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  revalidate("profile");

  return res.json();
}

export async function uploadAvatar(id, data) {
  const res = await fetch(`${HOSTNAME}/api/user/${id}?type=avatar`, {
    method: "PATCH",
    body: data,
  });

  if (!res.ok) {
    throw new Error("Failed to upload avatar", res.error);
  }

  revalidate("profile");
  return res.json();
}
