import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { SavedProfile } from "@/lib/supabase/schemas";
import { useAuth } from "./use-auth";

export function useSavedProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("saved_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (error) console.error(error);
      else setProfiles(data || []);
      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  return { profiles, loading };
}
