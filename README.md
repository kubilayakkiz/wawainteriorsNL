# Wawa Interiors NL

A modern, elegant Next.js website for Wawa Interiors NL - Interior Design & Execution Services.

## Features

- 🌍 Multilingual support (English & Dutch)
- 📱 Fully responsive design
- 🎨 Modern UI with custom color scheme (Black & #bfca02)
- 📝 Blog system with admin functionality
- 🖼️ Project portfolio with filtering
- 💼 Client panel for project tracking
- 📧 Email notifications for quote requests
- ☁️ Supabase integration for database and storage
- ⚡ Next.js 14 with App Router
- 🎯 SEO optimized

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Email:** Nodemailer (SMTP)
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- SMTP email account (for quote notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/wawainteriorsnl.git
cd wawainteriorsnl
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@wawainteriors.nl
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=info@wawainteriors.nl
SMTP_TO=info@kubilayakkiz.com,info@wawainteriors.nl
```

4. Set up Supabase:
- Run the SQL scripts in `supabase-schema.sql` in Supabase SQL Editor
- Create a storage bucket named `quote-attachments` and make it public
- Run `fix-quotes-rls-final.sql` to set up RLS policies

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions to Vercel.

## Project Structure

```
├── app/
│   ├── [locale]/          # Localized pages
│   │   ├── about/
│   │   ├── admin/         # Admin panel
│   │   ├── blog/
│   │   ├── client-panel/  # Client panel
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── quote/         # Quote request form
│   │   ├── services/
│   │   └── page.tsx       # Homepage
│   └── api/               # API routes
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── SubscribeSection.tsx
├── lib/
│   └── supabase.ts        # Supabase client
├── messages/              # Translation files
│   ├── en.json
│   └── nl.json
└── types/
    └── database.ts        # TypeScript types
```

## Services

- Residential Design & Execution
- Office Design & Execution
- Cafe & Restaurant Design & Execution
- Clinic & Healthcare Design & Execution
- Retail Store Design & Execution

## Contact Information

- **Address:** Herengracht 280, Amsterdam, 1016 BX, Netherlands
- **Email:** info@wawainteriors.nl
- **Phone:** +90 212 706 2832

## License

Private - All rights reserved
