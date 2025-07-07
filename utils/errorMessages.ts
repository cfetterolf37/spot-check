/**
 * Type for Supabase authentication errors.
 */
export interface SupabaseAuthError {
  message?: string;
  error_description?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Maps Supabase authentication errors to user-friendly messages.
 * @param error The error object from Supabase auth
 * @returns A user-friendly error message string
 */
export function getFriendlyAuthError(error: SupabaseAuthError | null | undefined): string {
  if (!error) return 'An unknown error occurred.';
  const msg = error.message || error.error_description || error.error || '';
  if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.';
  if (msg.includes('User already registered')) return 'This email is already registered.';
  if (msg.includes('Email not confirmed')) return 'Please confirm your email before logging in.';
  if (msg.includes('Password should be at least')) return 'Password is too short.';
  if (msg.includes('rate limit')) return 'Too many attempts. Please try again later.';
  // Add more mappings as needed
  return msg || 'An unknown error occurred.';
} 