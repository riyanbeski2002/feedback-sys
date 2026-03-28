# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript 5.6.2 - Full codebase (React components, Next.js pages, server actions)
- JavaScript - Configuration files (postcss.config.mjs)

**Secondary:**
- CSS/TailwindCSS - Styling with design tokens

## Runtime

**Environment:**
- Node.js (implied by Next.js 15 and package.json scripts)

**Package Manager:**
- npm (via package-lock.json, version management in package.json)
- Lockfile: package-lock.json present

## Frameworks

**Core:**
- Next.js 15.0.0 - Full-stack React framework with SSR, server actions, middleware
- React 19.0.0 - UI component library
- React DOM 19.0.0 - React rendering

**UI & Styling:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework (@tailwindcss/postcss 4.2.2)
- shadcn/ui - Radix-based component library (via components.json configuration)
- PostCSS 8.4.47 - CSS processing pipeline
- Autoprefixer 10.4.20 - Vendor prefix generation

**Form & Validation:**
- React Hook Form 7.53.0 - Form state management
- @hookform/resolvers 3.9.0 - Form validation integrations
- Zod 3.23.8 - TypeScript-first schema validation

**UI Components (Radix/shadcn):**
- @radix-ui/react-label 2.1.8 - Accessible label component
- @radix-ui/react-select 2.2.6 - Accessible select dropdown
- @radix-ui/react-slot 1.2.4 - Composition slot primitive
- lucide-react 0.446.0 - Icon library
- class-variance-authority 0.7.0 - Component variant management
- clsx 2.1.1 - Conditional className utility

**Animation & Interaction:**
- Framer Motion 12.38.0 - Motion and animation library
- Sonner 1.5.0 - Toast notification system

**Utilities:**
- date-fns 3.6.0 - Date manipulation and formatting
- tailwind-merge 2.5.2 - Tailwind class merging for dynamic styles
- next-themes 0.3.0 - Theme management (light/dark mode)

**Development:**
- ts-node 10.9.2 - TypeScript execution for scripts
- dotenv 17.3.1 - Environment variable loading

## Configuration

**Environment:**
- Configuration via environment variables with `.env.local` file
- Variables with prefix `NEXT_PUBLIC_` are exposed to browser
- Service role keys stored in non-public env vars

**Key Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase API endpoint
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role (server-only)

**Build:**
- `tsconfig.json` - TypeScript configuration at root
  - Target: ES2017
  - Module: esnext
  - Path alias: `@/*` → `./src/*`
  - Strict: false (not strict mode)
- `next-env.d.ts` - Auto-generated Next.js type definitions
- `postcss.config.mjs` - PostCSS configuration
- `tailwind.config.ts` - Expected but not found in current listing

**Component Configuration:**
- `components.json` - shadcn/ui configuration
  - Style: "new-york"
  - Component type: TSX
  - Base color: slate
  - CSS variables for theming enabled

## Platform Requirements

**Development:**
- Node.js runtime
- npm for package management
- TypeScript compiler
- No specific OS requirements detected

**Production:**
- Node.js runtime (for Next.js server)
- Can be deployed on Vercel (Next.js native platform)
- Supports self-hosted Node.js environments

## Type Safety

**TypeScript Configuration:**
- Strict mode: disabled (`strict: false`)
- JSX handling: "preserve" (handled by Next.js)
- Incremental compilation: enabled
- Module resolution: node

## Development Scripts

```bash
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run linting (Next.js built-in)
npm run seed     # Seed database with demo data (ts-node)
```

---

*Stack analysis: 2026-03-28*
