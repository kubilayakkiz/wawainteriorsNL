# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings: https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# IMPORTANT: Service Role Key (required for admin panel operations)
# This bypasses Row Level Security (RLS) policies
# Keep this secret! Never expose it in client-side code publicly (but Next.js will bundle it).
# Use NEXT_PUBLIC_ prefix if you want it accessible in browser (admin panel needs it)
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# OR use without NEXT_PUBLIC_ for server-side only (recommended for production)
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Setup

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to SQL Editor
3. Run the SQL script from `supabase-schema.sql` to create all tables and policies

## Tables Created

- **customers**: Customer information and user account linking
- **blog_posts**: Blog articles with locale support
- **projects**: Portfolio projects (managed by developer)
- **quotes**: Customer quote requests
- **jobs**: Active projects with status tracking

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Blog Posts & Projects**: Public read access for published items, admin-only write access
- **Quotes**: Customers can view their own quotes, admins can manage all
- **Jobs**: Customers can view their own jobs, admins can manage all
- **Customers**: Users can view/update their own records, admins can manage all

## Authentication

Customer authentication uses Supabase Auth. 

### Enable Email Signup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Email** provider
4. Configure email settings:
   - **Confirm email**: You can enable or disable this. If disabled, users will be logged in immediately after signup.
   - **Secure email change**: Recommended to enable
   - **Email templates**: Customize as needed

### Email Templates (Optional)

If email confirmation is enabled, customize the email templates in:
- **Authentication** > **Email Templates** > **Confirm signup**

### Admin Users

To set a user as admin, update their `raw_user_meta_data` in the auth.users table:

```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb), 
  '{role}', 
  '"admin"'
) 
WHERE id = 'user-uuid-here';
```

### Troubleshooting

**"Anonymous sign-ins are disabled" error:**
- Go to Supabase Dashboard > Authentication > Providers
- Make sure **Email** provider is enabled (not just Anonymous)
- Check that email confirmation settings are configured correctly

