"use client";
import { useAuth } from "@/hooks/use-auth";
import { useSavedProfiles } from "@/hooks/use-saved-profiles";
import { LogoutButton } from "@/components/auth/logout-button";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { profiles } = useSavedProfiles();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
        <p>Saved Profiles: {profiles.length}</p>

        {/* Add more dashboard content here */}
      </main>
    </div>
  );
}
