"use client";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">GitAnalyzer</h1>
        <p className="text-slate-300 mb-8">
          Sign in to save and compare profiles
        </p>
        <Button onClick={handleGitHubLogin} size="lg">
          <Github className="h-5 w-5 mr-2" />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
