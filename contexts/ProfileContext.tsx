import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfile, uploadAvatar, upsertProfile, UserProfile } from '../services/profile';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (fields: Partial<UserProfile>) => Promise<boolean>;
  uploadAvatarAndUpdate: (uri: string) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    const p = await getProfile(user.id);
    if (p) {
      setProfile(p);
    } else {
      setError('Failed to fetch profile');
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [user?.id, refreshProfile]);

  const updateProfile = async (fields: Partial<UserProfile>) => {
    if (!user?.id) return false;
    setLoading(true);
    setError(null);
    const error = await upsertProfile({ id: user.id, ...fields });
    if (!error) {
      setProfile((prev) => ({ ...prev, ...fields, id: user.id } as UserProfile));
      setLoading(false);
      return true;
    } else {
      setError('Failed to update profile');
      setLoading(false);
      return false;
    }
  };

  const uploadAvatarAndUpdate = async (uri: string) => {
    if (!user?.id) return false;
    setLoading(true);
    setError(null);
    const url = await uploadAvatar(user.id, uri);
    if (url) {
      const success = await updateProfile({ avatar_url: url });
      setLoading(false);
      return success;
    } else {
      setError('Failed to upload avatar');
      setLoading(false);
      return false;
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile, updateProfile, uploadAvatarAndUpdate }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
} 