export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  company?: string;
  role?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  uid: string;
  emailNotifications: boolean;
  testReminders: boolean;
  weeklyReport: boolean;
  publicProfile: boolean;
  showEmail: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  updatedAt: Date;
}
