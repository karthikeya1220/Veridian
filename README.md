# VC Scout — Precision VC Sourcing Intelligence

## Overview

A Harmonic-style venture capital discovery interface with live AI enrichment. Built as a take-home assignment demonstrating:
- Full-stack Next.js app with clean component architecture
- Live website enrichment pipeline (scrape → extract → display)
- Thesis-first company scoring and filtering
- Production-safe API key handling

## Live Demo

[App URL](https://your-vercel-url.vercel.app)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (persist + immer) |
| Scraping | Jina.ai Reader (no API key needed) |
| AI Extraction | Google Gemini 2.0 Flash |
| Deployment | Vercel |

## Features

✅ Professional B2B SaaS landing page with hero, features, testimonials  
✅ Analytics dashboard (/dashboard) with KPIs, charts, and activity timeline  
✅ Company discovery with search + 6 faceted filters  
✅ Sortable, paginated company table (25 mock companies)  
✅ Company profiles with overview, signals, notes tabs  
✅ Live AI enrichment — scrapes real websites, extracts intelligence  
✅ Enrichment caching (30 min TTL, in-memory)  
✅ Save companies to named lists, export as CSV  
✅ Save and re-run searches with filter restoration  
✅ Bulk select + add to list  
✅ Cmd+K global search command palette  
✅ Server-side API key handling (never exposed to browser)  
✅ Rate limiting on enrichment endpoint (10 req/min per IP)  

## Enrichment Pipeline

```
Browser → POST /api/enrich { url }
     → Check in-memory cache (30 min TTL)
     → Jina.ai scrapes homepage + /about + /careers (parallel)
     → Gemini 2.0 Flash extracts structured JSON
     → Returns: summary, bullets, keywords, signals, sources
     → Cached in server memory, stored in Zustand client-side
```

## Local Setup

### Prerequisites

- Node.js 18+
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/vc-scout.git
cd vc-scout
npm install
cp .env.example .env.local
```

Add your API key to `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

Then start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GEMINI_API_KEY | Yes | Google Gemini API key for AI extraction |

## Project Structure

```
Veridian/
├── app/
│   ├── layout.tsx              # Root layout with sidebar + global search
│   ├── page.tsx                # Landing page (redirect to /dashboard)
│   ├── globals.css             # Global styles
│   ├── dashboard/
│   │   └── page.tsx            # Analytics dashboard with KPIs, charts, feeds
│   ├── companies/
│   │   ├── page.tsx            # Discovery page with filtering, sorting, pagination
│   │   └── [id]/
│   │       └── page.tsx        # Company profile with 4 tabs
│   ├── lists/
│   │   └── page.tsx            # List management interface
│   ├── saved/
│   │   └── page.tsx            # Saved searches with filter restoration
│   └── api/
│       └── enrich/
│           └── route.ts        # AI enrichment endpoint (scrape + extract)
├── components/
│   ├── ui/                     # shadcn/ui components (button, card, dialog, etc.)
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── global-search.tsx       # Cmd+K search command palette
│   ├── filter-bar.tsx          # Company table filters
│   ├── company-table.tsx       # Sortable company table
│   ├── pagination.tsx          # Custom pagination with ellipsis
│   ├── profile-header.tsx      # Company profile header (logo, details, actions)
│   ├── overview-tab.tsx        # Company overview section
│   ├── signals-tab.tsx         # Enrichment signals display
│   ├── notes-tab.tsx           # User notes CRUD
│   ├── enrich-panel.tsx        # AI enrichment UI (trigger, results, caching)
│   ├── save-search-dialog.tsx  # Save search dialog
│   ├── kpi-cards.tsx           # Dashboard KPI cards (6 metrics)
│   ├── sector-chart.tsx        # Sector breakdown donut chart
│   ├── stage-chart.tsx         # Funding stage bar chart
│   ├── top-companies.tsx       # Top 8 companies leaderboard
│   ├── recent-enrichments.tsx  # Recent enrichments feed
│   ├── activity-timeline.tsx   # Combined activity timeline
│   └── lists-summary.tsx       # Watchlists summary widget
├── lib/
│   ├── store.ts                # Zustand store (companies, filters, lists, notes)
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Utilities (formatDate, scoreColor, etc.)
│   └── mock-data.ts            # 25 mock VC companies
├── hooks/
│   └── use-mobile.ts           # Mobile detection hook
├── public/                     # Static assets
├── .env.local                  # API keys (git-ignored)
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
└── package.json                # Dependencies
```

## Dashboard Features

The `/dashboard` page provides a comprehensive analytics view:

### KPI Cards (6 Metrics)
- **Total Companies** - Count with weekly change trend
- **Avg Thesis Score** - Average across all companies (0-100)
- **AI Enriched** - Count of enriched companies with remaining work items
- **High Signal** - Companies with thesis score ≥ 80
- **Watchlists** - Active lists count
- **Notes Written** - Total notes across all companies

### Data Visualizations
- **Sector Breakdown** - Donut chart showing company distribution across 7 sectors (AI Infra, DevTools, FinTech, HealthTech, B2B SaaS, Climate, Security)
- **Stage Distribution** - Bar chart showing funding stage breakdown (Pre-seed, Seed, Series A, Series B) with average thesis scores
- **Top Companies** - Leaderboard of 8 highest-scoring companies with enrichment status and export
- **Recent Enrichments** - 6-item feed showing latest enriched companies with metadata
- **Activity Timeline** - Combined timeline showing enrichments, notes, lists, and saved searches
- **Watchlists Summary** - Quick access to 5 most recent lists with export buttons

## Landing Page (/home)

Professional B2B SaaS marketing page featuring:
- **Hero Section** - Value proposition with dual CTAs (Get Started, Demo)
- **Trust Bar** - Social proof with fake VC firm names
- **Product Preview** - Interactive browser mockup showing the app interface
- **6 Feature Cards** - Highlights: Thesis Filters, AI Enrichment, Scoring, Signals, Lists, Security
- **Metrics Bar** - Dark navy section with 4 key metrics (25,000+ companies, <8s enrichment, 94% accuracy, 10x faster)
- **How It Works** - 4-step timeline explaining the workflow
- **Testimonials** - 3 fictional quotes from fund professionals
- **Final CTA** - Call-to-action with checklist (no credit card, <5 min setup)

## Design Decisions

### Jina.ai for Web Scraping
No API key required, handles JavaScript-rendered sites elegantly, returns clean markdown, and free tier is sufficient for demo use. Alternative: Firecrawl (paid, more reliable).

### In-Memory Cache Over Redis
Appropriate for single-instance demo deployment, avoids infrastructure complexity, and 30-minute TTL balances data freshness against API costs. For production: move to Upstash Redis.

### Zustand Over Redux
Lighter weight, built-in `persist` middleware handles localStorage with zero boilerplate, and `immer` enables clean mutations without reducer boilerplate. Redux would add unnecessary complexity for this scope.

## Known Limitations

- Mock data only (no real database)
- Enrichment cache resets on server restart
- Jina.ai may timeout on slow or JavaScript-heavy sites
- Rate limit is per-IP in memory, resets on server restart
- Gemini API model availability varies by region/tier

## If I Had More Time

- Vector similarity search for thesis-match scoring
- Real company database (PostgreSQL + Prisma)
- Slack/email alerts for new high-score matches
- Persistent cache (Redis or Upstash)
- Founder social signal tracking (Twitter, LinkedIn APIs)
- Export to Airtable/Notion
- Advanced NLP for signal categorization
- A/B testing on filter UX patterns

---

**Built with ❤️ by Darshan Karthikeya using Next.js 16, Tailwind CSS, and Google Gemini.**
