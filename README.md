# Wawa Interiors NL

A modern, elegant Next.js website for Wawa Interiors NL - Interior Design & Execution Services.

## Features

- 🌍 Multilingual support (English & Dutch)
- 📱 Fully responsive design
- 🎨 Modern UI with custom color scheme (Black & #bfca02)
- 📝 Blog system with admin functionality
- 🖼️ Placeholder images
- ⚡ Next.js 14 with App Router
- 🎯 SEO optimized

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The site will automatically redirect to `/en` (English) or you can access `/nl` for Dutch.

### Build for Production

```bash
npm run build
npm start
```

## Pages

- **Homepage** (`/en` or `/nl`) - Hero section, services overview, featured projects
- **About Us** (`/about`) - Company mission, vision, and values
- **Our Projects** (`/projects`) - Portfolio with filtering by category
- **Our Services** (`/services`) - Detailed service descriptions
- **Blog** (`/blog`) - Blog posts with admin management
- **Contact** (`/contact`) - Contact form and information
- **Quote Request** (`/quote`) - Detailed quote request form

## Blog Admin

Access the blog admin panel at `/en/blog/admin` or `/nl/blog/admin`.

**Default Password:** `admin123`

⚠️ **Important:** Change the password in production! Edit `app/[locale]/blog/admin/page.tsx` and update the `ADMIN_PASSWORD` constant.

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

## Technology Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- next-intl (Internationalization)
- Framer Motion (Animations)
- Lucide React (Icons)

## Color Scheme

- **Primary:** #bfca02 (Lime Green)
- **Secondary:** #000000 (Black)
- **Accent:** #9ba002 (Dark Green)

## Project Structure

```
├── app/
│   ├── [locale]/          # Localized pages
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── services/
│   │   ├── quote/
│   │   └── page.tsx       # Homepage
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   └── Footer.tsx
├── messages/              # Translation files
│   ├── en.json
│   └── nl.json
└── i18n.ts               # i18n configuration
```

## Customization

### Changing Colors

Edit `tailwind.config.ts` to modify the color scheme.

### Adding Translations

Edit `messages/en.json` and `messages/nl.json` to add or modify translations.

### Blog Storage

Currently, blog posts are stored in browser localStorage. For production, consider:
- Using a database (PostgreSQL, MongoDB)
- Using a CMS (Contentful, Sanity)
- Using a file-based system (Markdown files)

