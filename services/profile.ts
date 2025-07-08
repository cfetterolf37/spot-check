import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertProfile(profile: Partial<UserProfile>) {
  const { error } = await supabase.from('user_profiles').upsert(profile, { onConflict: 'id' });
  return error;
}

export async function uploadAvatar(userId: string, uri: string): Promise<string | null> {
  const ext = uri.split('.').pop();
  const fileName = `${userId}.${ext}`;
  
  try {
    // Read the file as base64
    await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Create FormData with the file
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/png', // or determine from extension
      name: fileName,
    } as any);
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, formData, { upsert: true });
    
    if (error) {
      console.log('Upload error:', error);
      return null;
    }
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data?.publicUrl ?? null;
  } catch (err) {
    console.log('Exception during upload:', err);
    return null;
  }
}