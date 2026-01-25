import { ProfileAnalysisContent } from "@/components/profile/profile-analysis-content";

export default async function ProfileAnalysisPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <ProfileAnalysisContent username={username} />;
}
