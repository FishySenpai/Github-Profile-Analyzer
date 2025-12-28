export interface User {
  id: string;
  email: string;
  username: string;
  github_username?: string;
  avatar?: string;
  created_at: string;
}

export interface SavedProfile {
  id: string;
  user_id: string;
  github_username: string;
  profile_data: any;
  notes?: string;
  saved_at: string;
  is_favorite: boolean;
}

export interface ProfileComparison {
  id: string;
  user_id: string;
  profile1_username: string;
  profile2_username: string;
  comparison_data: any;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  theme: "light" | "dark";
  export_format: "pdf" | "json";
  notifications: boolean;
}
