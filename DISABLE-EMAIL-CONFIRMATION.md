# Disable Email Confirmation in Supabase

## Steps to Disable Email Confirmation

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Click on **Email** provider
5. Find the setting **"Confirm email"**
6. **Disable** it (toggle it OFF)
7. Save the changes

After disabling email confirmation:
- Users will be logged in immediately after signup
- No email verification required
- Better user experience for development/testing

## Alternative: Keep Email Confirmation Enabled

If you want to keep email confirmation enabled, you need to:

1. Go to **Authentication** > **Email Templates**
2. Check **"Confirm signup"** template
3. Make sure email sending is configured properly
4. Check your email provider settings in Supabase

Note: For development, it's recommended to disable email confirmation.

