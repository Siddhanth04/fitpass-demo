# 🏋️ FitPass — Fitness Class Booking Platform

A full-stack SaaS fitness class booking platform built with **Next.js 16**, **Sanity CMS**, **Clerk Auth**, and **Mapbox/Leaflet** interactive maps. Members can discover, filter, and book fitness classes across nearby studios — all powered by an AI assistant and a tiered subscription model.

---

## ✨ Features

- 🗺️ **Interactive Map** — Browse classes and venues on a Leaflet-powered map, filtered by your location radius
- 🔍 **Smart Filtering** — Filter by category (Yoga, HIIT, Boxing, etc.), subscription tier, and venue
- 📅 **Class Booking** — Book upcoming sessions with real-time capacity tracking
- 🤖 **AI Assistant** — Built-in chat assistant (powered by OpenAI via Vercel AI SDK) to help find classes
- 💳 **Subscription Tiers** — Three plans (Basic / Performance / Champion) with Clerk Billing + Stripe
- 👤 **User Profiles** — Onboarding flow to set location, search radius, and subscription tier
- 📖 **Booking History** — View upcoming, past, and all bookings in one place
- 🎛️ **Sanity Studio** — Full CMS at `/studio` for managing classes, venues, activities, and categories
- 🌗 **Dark Mode** — Light and dark theme support via `next-themes`

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **CMS** | [Sanity v4](https://sanity.io) with live content |
| **Auth & Billing** | [Clerk](https://clerk.com) with built-in Stripe billing |
| **Maps** | [React Leaflet](https://react-leaflet.js.org) + Leaflet.js |
| **AI** | [Vercel AI SDK](https://sdk.vercel.ai) + OpenAI |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **UI Components** | [Radix UI](https://www.radix-ui.com) + custom components |
| **State** | [Zustand](https://zustand-demo.pmnd.rs) |
| **Validation** | [Zod v4](https://zod.dev) |
| **Linting** | [Biome](https://biomejs.dev) |
| **Package Manager** | [pnpm](https://pnpm.io) |

---

## 📁 Project Structure

```
.
├── app/
│   ├── (app)/              # Main user-facing app
│   │   ├── page.tsx        # Landing / marketing page
│   │   ├── classes/        # Browse & filter classes
│   │   ├── bookings/       # My bookings (upcoming + history)
│   │   ├── profile/        # User profile & settings
│   │   ├── onboarding/     # First-time setup flow
│   │   └── upgrade/        # Subscription pricing (Clerk PricingTable)
│   ├── (admin)/            # Admin dashboard
│   ├── api/chat/           # AI chat API route (Vercel AI SDK)
│   └── studio/             # Sanity Studio (embedded)
├── components/
│   ├── app/
│   │   ├── classes/        # Class cards, filters, search
│   │   ├── maps/           # ClassesMapSidebar, VenueMap, AddressSearch
│   │   ├── bookings/       # Booking cards and history
│   │   ├── chat/           # AI chat sheet + button
│   │   ├── layout/         # AppHeader, AppShell
│   │   └── onboarding/     # Onboarding guard + forms
│   └── ui/                 # Reusable UI primitives (map, button, card, etc.)
├── lib/
│   ├── actions/            # Server Actions (bookings, users, sessions)
│   ├── ai/                 # AI system prompt & tools
│   ├── constants/          # Subscription tier config
│   ├── hooks/              # Custom React hooks
│   └── store/              # Zustand stores (chat, etc.)
├── sanity/
│   ├── lib/                # Sanity client, live, image helpers
│   ├── queries/            # GROQ query definitions
│   └── schemaTypes/        # Content schemas (venue, activity, classSession, etc.)
├── scripts/
│   └── update-session-dates.mjs  # Utility: bump sample data dates to future
└── sample-data.ndjson     # Sample Sanity dataset (5 Dubai venues, 53 sessions)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- A [Sanity](https://sanity.io) project
- A [Clerk](https://clerk.com) application (with billing enabled)
- An [OpenAI](https://platform.openai.com) API key

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd class-booking-app-nextjs-16-ai-saas-sanity-clerk-billing-mapbox
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_TOKEN=sk...         # Editor/write token (for server actions)

# OpenAI
OPENAI_API_KEY=sk-...
```

### 3. Import Sample Data

```bash
npx sanity dataset import sample-data.ndjson production --replace
```

This imports **79 documents**: 5 venues (all in **Dubai, UAE**), activities, categories, and 53 class sessions.

### 4. Update Session Dates

The sample data sessions have past dates. Run this once to shift them to the future:

```bash
node scripts/update-session-dates.mjs
```

### 5. Generate Sanity Types

```bash
pnpm typegen
```

### 6. Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** When browsing classes, set your location to **Dubai, UAE** — that's where all sample venues are located.

---

## 💳 Subscription Tiers

| Plan | Price | Classes/Month | Class Access | Advance Booking |
|---|---|---|---|---|
| **Basic** | $29/mo | 5 | Basic only | 3 days |
| **Performance** | $59/mo | 12 | Basic + Performance | 7 days |
| **Champion** | $99/mo | Unlimited | All classes | 14 days |

Billing is handled by **Clerk + Stripe**. To enable, visit your [Clerk Billing Settings](https://dashboard.clerk.com/last-active?path=billing/settings) and connect a Stripe account.

---

## 🎛️ Sanity Studio

The embedded Sanity Studio is available at:

```
http://localhost:3000/studio
```

### Content Types

| Schema | Description |
|---|---|
| `venue` | Fitness studios with address, coordinates, amenities, opening hours |
| `activity` | A class type (e.g. "Vinyasa Yoga") with instructor, duration, tier level |
| `classSession` | A scheduled instance of an activity at a venue with a specific `startTime` |
| `category` | Class categories (Yoga, HIIT, Boxing, etc.) |
| `booking` | User bookings linking a user profile to a class session |
| `userProfile` | User preferences — location, search radius, subscription tier |

---

## 🤖 AI Chat Assistant

The floating chat button (bottom-right) opens an AI assistant powered by OpenAI. It can:

- Find upcoming classes by category or instructor
- Check class availability
- Summarize your bookings
- Answer general fitness questions

API route: `app/api/chat/route.ts`

---

## 🛠️ Useful Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Auto-format with Biome |
| `pnpm typegen` | Extract Sanity schema & generate TypeScript types |
| `node scripts/update-session-dates.mjs` | Bump sample class session dates to the future |

---

## 🚢 Deployment

Deploy to [Vercel](https://vercel.com) in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add all environment variables from `.env.local` in your Vercel project settings.

---

## 📝 License

MIT
