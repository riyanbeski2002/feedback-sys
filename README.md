# Post-Stay Feedback Intelligence System

A robust, automated feedback loop for corporate travel management. This system captures verified guest experiences, applies AI-driven sentiment analysis, and dynamically adjusts hotel rankings based on a weighted reliability algorithm.

## 🚀 Key Features

- **Booking Simulation**: Trigger feedback eligibility directly from your bookings.
- **Intelligent Feedback Form**: Detailed multi-category rating system with star-based inputs.
- **AI Analysis Engine**:
  - **Sentiment Labeling**: Automatically tags feedback as Positive, Neutral, or Negative.
  - **Issue Categorization**: Detects themes like "Service", "Cleanliness", or "Value".
  - **Urgency Flagging**: Highlights critical negative feedback for immediate admin attention.
- **Weighted Reliability Ranking**: Dynamic hotel sorting based on 5 weighted pillars.
- **Admin Dashboard**: Real-time operational overview with quality metrics and flagged properties.
- **Notification Center**: Multi-channel preview (Email, WhatsApp, Slack, Teams) for feedback requests.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Real-time)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### 1. Prerequisite: Supabase Setup

1.  Create a new project at [Supabase](https://supabase.com/).
2.  Go to the **SQL Editor** in the Supabase dashboard.
3.  Copy and run the contents of `basic/09_database_schema.sql` to initialize your tables.

### 2. Local Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

*Note: The `SUPABASE_SERVICE_ROLE_KEY` is only required if you want to run the initial demo data seed.*

### 3. Installation & Run

1.  **Install dependencies**:
    ```bash
    # If you have permission issues with npm cache:
    mkdir -p .npm_local && npm install --cache ./.npm_local --legacy-peer-deps
    ```
2.  **Seed Demo Data** (Optional):
    ```bash
    npm run seed
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev -- --port 3000
    ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

- `src/app`: Next.js pages and routing.
- `src/features`: Core business logic (Admin, Feedback, Bookings, Hotels, Notifications).
- `src/components/ui`: Reusable UI primitives (shadcn/ui).
- `src/lib`: Database client and shared utilities.

## 🚢 Deployment (Vercel)

1.  Push your code to a GitHub repository.
2.  Import the project into [Vercel](https://vercel.com/).
3.  Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the **Environment Variables** in Vercel settings.
4.  Deploy!

---
*Developed as part of the Ziptrrip Feedback Intelligence System.*
