"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SaveProfileButton({
  profileData,
  username,
}: {
  profileData: Record<string, unknown>;
  username: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("saved_profiles").insert({
        user_id: user.id,
        github_username: username,
        profile_data: profileData,
        saved_at: new Date().toISOString(),
        is_favorite: false,
      });

      if (error) throw error;

      setIsSaved(true);
      toast.success("Profile saved!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSaveProfile}
      disabled={isLoading}
      variant={isSaved ? "default" : "outline"}
      size="sm"
    >
      <Star className="h-4 w-4 mr-2" fill={isSaved ? "currentColor" : "none"} />
      {isSaved ? "Saved" : "Save Profile"}
    </Button>
  );
}
