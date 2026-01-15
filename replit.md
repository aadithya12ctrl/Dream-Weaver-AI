# Oneiros - Dream Journal Application

## Overview

Oneiros is a full-stack dream journaling application that combines AI-powered analysis with personal dream tracking. Users can record their dreams, receive symbolic interpretations using LLM analysis, track emotional patterns over time, and explore insights from their subconscious through visualizations and semantic search.

The application uses a React frontend with a mystical, dark-themed UI, an Express backend with PostgreSQL database, and integrates Python ML services for dream analysis including embeddings and LangChain-based interpretation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Shadcn/ui component library with Radix primitives
- **Styling**: Tailwind CSS with custom mystical dark theme (CSS variables in index.css)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for emotional trend visualization

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Build Process**: Custom build script using esbuild for server, Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Key Tables**:
  - `users` and `sessions` - Replit Auth integration
  - `dreams` - Dream entries with embeddings stored as JSONB
  - `analyses` - AI-generated interpretations, symbols, themes
  - `conversations` and `messages` - Chat history for AI interactions

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Implementation**: Located in `server/replit_integrations/auth/`

### AI/ML Integration
- **LLM Provider**: OpenAI-compatible API via Replit AI Integrations
- **Python ML Pipeline**: Located in `ml/` directory
  - `analyze.py` - Entry point for dream analysis
  - `engine.py` - LangChain LCEL pipeline for symbolic interpretation
  - Sentence Transformers for embedding generation
- **Features**: Text generation, image generation, text-to-speech, speech-to-text

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components including Shadcn
│   ├── hooks/           # Custom React hooks (use-auth, use-dreams)
│   ├── pages/           # Route components
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── replit_integrations/  # Auth, chat, image, audio modules
│   ├── routes.ts        # API endpoint definitions
│   └── storage.ts       # Database access layer
├── shared/              # Shared TypeScript code
│   ├── schema.ts        # Drizzle database schema
│   ├── routes.ts        # API contract definitions
│   └── models/          # Auth and chat models
├── ml/                  # Python ML services
└── migrations/          # Drizzle database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and query building

### AI Services (via Replit AI Integrations)
- **OpenAI-compatible API**: Chat completions, image generation, audio processing
- **Environment Variables**:
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Python Dependencies
- **sentence-transformers**: Embedding generation for semantic search
- **langchain/langchain-openai**: LLM orchestration for dream analysis
- **PyTorch**: Neural network components (LSTM for temporal patterns)

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Environment Variables**:
  - `ISSUER_URL` (defaults to Replit OIDC)
  - `REPL_ID`
  - `SESSION_SECRET`

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `framer-motion` - Animations
- `recharts` - Data visualization
- `date-fns` - Date formatting
- `zod` - Runtime validation
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations