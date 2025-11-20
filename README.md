# InfluenceOS — Agentic Creator Suite

InfluenceOS is an autonomous production stack for digital influencers. It hosts a strategic copilot, visual asset foundry, image-to-video synthesizer, and growth playbook generator—built on Next.js for seamless deployment to Vercel.

## ✨ Capabilities

- **Strategic Agent** — conversational planner that crafts growth missions, scripts, and command queues.
- **Visual Creator** — prompt-driven generator that produces high-impact social graphics via OpenAI Images.
- **Video Director** — animates stills into dynamic motion using Replicate image-to-video models.
- **Growth Engine** — delivers audience positioning, content pillars, channel cadences, and 14‑day publishing calendars.

## ⚙️ Tech Stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS for styling
- Zustand for client state
- OpenAI API for strategy and art direction
- Replicate API for motion synthesis

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to access the agentic studio.

## 🔐 Environment

Copy `.env.example` to `.env.local` and provide keys:

```
OPENAI_API_KEY=sk-...
REPLICATE_API_TOKEN=r8_...
```

Both services are required for full functionality. The UI gracefully handles missing credentials but generations will fail.

## 🧪 Quality Gates

- `npm run lint` — ESLint with TypeScript rules
- `npm run build` — Next.js production build
- `npm run typecheck` — isolated TypeScript validation

## 🛠️ Deployment

The project is preconfigured for Vercel. Ensure environment variables are defined in the Vercel dashboard, then run:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-cfe2891e
```

## 📁 Structure

- `app/` — UI, layouts, and API routes
- `components/` — shared UI + state
- `lib/` — API clients and utilities

## 📄 License

MIT — feel free to adapt and extend. Attribution appreciated but not required.
