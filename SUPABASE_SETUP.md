# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your Expo app with email/password and Google OAuth.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key from the API settings

## 2. Configure Supabase Authentication

### Email/Password Authentication
1. In your Supabase dashboard, go to Authentication > Settings
2. Enable "Enable email confirmations" if you want email verification
3. Configure email templates as needed

### Google OAuth Setup
1. Go to Authentication > Providers
2. Enable Google provider
3. Create a Google OAuth application:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `spotcheck://auth/callback` (for mobile app)
4. Copy the Client ID and Client Secret to Supabase Google provider settings

## 3. Update Your App Configuration

1. Open `lib/supabase.ts`
2. Replace the placeholder values with your actual Supabase credentials:
   ```typescript
   const supabaseUrl = 'https://your-project-ref.supabase.co';
   const supabaseAnonKey = 'your-anon-key';
   ```

## 4. Configure URL Schemes

The app is already configured with the `spotcheck` URL scheme. Make sure to:

1. Update the bundle identifier in `app.json` to match your app:
   ```json
   "ios": {
     "bundleIdentifier": "com.yourcompany.spotcheck"
   },
   "android": {
     "package": "com.yourcompany.spotcheck"
   }
   ```

## 5. Test the Authentication

1. Run your app: `npm start`
2. Test email/password registration and login
3. Test Google OAuth sign-in
4. Verify that users are redirected properly after authentication

## 6. Additional Configuration

### Email Templates
Customize email templates in Supabase dashboard:
- Authentication > Email Templates
- Configure confirmation, recovery, and change email templates

### Row Level Security (RLS)
Enable RLS on your tables and create policies to secure user data:

```sql
-- Example: Enable RLS on a users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access only their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

### User Profiles
Create a user profiles table to store additional user information:

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 7. Environment Variables (Recommended)

For production, use environment variables:

1. Create a `.env` file:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Update `lib/supabase.ts`:
   ```typescript
   const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
   const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
   ```

## 8. Troubleshooting

### Common Issues:
1. **OAuth redirect errors**: Make sure redirect URIs are correctly configured
2. **Network errors**: Check if your Supabase project is accessible
3. **Session persistence**: Verify AsyncStorage is working correctly

### Debug Mode:
Enable debug logging in development:
```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-react-native'
    }
  }
});
```

## 9. Next Steps

- Add password reset functionality
- Implement user profile management
- Add additional OAuth providers (GitHub, Facebook, etc.)
- Set up database tables and RLS policies
- Add offline support with Supabase real-time subscriptions 