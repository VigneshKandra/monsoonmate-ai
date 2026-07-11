# MonsoonMate AI

MonsoonMate AI is a production-ready, mobile-first emergency preparedness command center powered by Google Gemini. It empowers individuals, families, and communities to compile personalized safety checklists, timeline protocols, and transit plans tailored to their demographic vulnerabilities and structural parameters before the monsoon begins.

## Problem Statement

During monsoon seasons, severe precipitation frequently leads to urban flooding, waterborne health risks, power outages, and transit disruptions. Standard civil safety guidelines are often generic and fail to address specific household dependencies:
- Families with seniors, children, pregnant members, or pets require distinct supplies.
- Structural risks differ significantly between high-rise apartments, independent houses, and low-lying floodplains.
- Standard guidelines are rarely available in preferred regional languages.
- Meteorological warnings are often isolated, leaving citizens without actionable, step-by-step preparation directives.

## Solution Overview

MonsoonMate AI addresses these vulnerabilities by offering:
1. **Interactive Configurator**: A multi-step readiness profile questionnaire capturing precise coordinates, household configurations, house types, transport modes, and languages.
2. **Secure Server-Side AI Orchestration**: A Next.js API route that processes configurations and executes prompt-engineered, context-aware requests to Google Gemini, avoiding any API key exposure to the client.
3. **Preparedness Command Dashboard**: A high-fidelity, color-coded dashboard displaying personalized risk evaluations, priority actions, phase-based safety timelines (Pre-Storm, In-Storm, Recovery), travel safety parameters, and printable checklists.
4. **Client-Side PDF Exports**: Custom-drawn, multi-page PDF documents generated entirely inside the browser for offline availability when local grids fail.

---

## Architecture Diagram

```text
               +-------------------------------------------------+
               |                   USER BROWSER                  |
               |                                                 |
               |  +--------------------+   +------------------+  |
               |  |  Landing Page UI   |   |   Questionnaire  |  |
               |  +--------------------+   +--------+---------+  |
               |                                    |            |
               |  +--------------------+            | Submit     |
               |  |   Command Board    |            v            |
               |  |  Interactive Deck  |   +------------------+  |
               |  +---------+----------+   |    gemini.ts     |  |
               |            ^              |  (Client Fetch)  |  |
               |            | Render Plan  +--------+---------+  |
               |            |                       |            |
               +------------|-----------------------|------------+
                            |                       |
                            |                       | POST /api/generate-plan
                            |                       | (JSON payload)
                            |                       v
               +------------|-----------------------|------------+
               |            |             NEXT.JS API ROUTE      |
               |  +---------+----------+   +--------+---------+  |
               |  |   JSON response    |<--|    route.ts      |  |
               |  |    plan object     |   |  (Google SDK)    |  |
               |  +--------------------+   +--------+---------+  |
               |                                    |            |
               |                                    | Call Model |
               |                                    v            |
               |                           +------------------+  |
               |                           |  Google Gemini   |  |
               |                           |  2.5-Flash model |  |
               |                           +------------------+  |
               |                                                 |
               +-------------------------------------------------+
```

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, Server-Side API Routes)
- **Runtime & UI**: React 19, TypeScript
- **Styling**: TailwindCSS v4
- **Design Tokens**: shadcn/ui primitives, Lucide React icons
- **AI Engine**: `@google/genai` (Official Google GenAI Node.js SDK)
- **PDF Compiler**: `jspdf` (Client-side vector document generation)
- **Environment Management**: Secure Next.js Server Configurations

---

## AI Workflow

1. **Parameters Packaging**: Profile choices are structured into a clean JSON payload.
2. **Context Enrichment**: The prompt context establishes a *senior disaster preparedness officer and emergency planner* persona.
3. **Personalization Directives**: XML-style directive tags parse details:
   - *Dependencies*: Children (formula/pediatric medicine), seniors (medical aids/battery backups), pregnant members (evacuation paths), pets (leashes/rations).
   - *Housing*: Apartments (terrace blocks), village houses (wall reinforcement), flood lowlands (sandbags/elevating electronics).
   - *Transit*: Car (underpass danger alerts), bike (hydroplaning advisory), walk (pedestrian safety paths).
4. **Hallucination Prevention**: Strict rules prevent the model from inventing current rainfall volumes, requiring it to state weather assumptions instead.
5. **Localization**: Translates response values to the user's selected language (Hindi, English, Kannada, Telugu, Tamil, Malayalam) while retaining the original JSON keys.
6. **API Timeout Protection**: Uses a 15-second Promise-race timer on the server route to abort hanging requests.

---

## Features

- **Mobile-First Responsive Layout**: Smooth, high-fidelity dark-mode interface built for tablets, phones, and desktops.
- **Simulated GPS Location Acquisition**: Easy geolocation parameter fills.
- **Glassmorphic Loading overlay**: Fullscreen compile state displaying rotating progress cues ("Assessing monsoon risk...", "Building travel advisory...") and an animated progress bar displaying completion percentages.
- **Interactive Checklists**: State-aware checklists for priority actions and grab-bag items.
- **Color-Coded Threat Indicators**: Custom borders and badges corresponding to *Low, Moderate, High, and Severe* risk levels.
- **Telephony Directories**: Custom local helplines based on city settings.
- **Offline Exports**: Instantly export documents as clean PDFs with headers, dividers, footers, and page numbers.

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── generate-plan/
│   │       └── route.ts         # Secure server-side Gemini SDK endpoint
│   ├── layout.tsx               # Root layout & global SEO metadata
│   ├── page.tsx                 # View controller swapping Landing/Dashboard
│   └── globals.css              # Custom Tailwind v4 themes & animations
├── components/
│   ├── ui/                      # shadcn primitives (Dialog, Button, Input, etc.)
│   └── ErrorAlert.tsx           # Reusable user-friendly error card with retry
├── features/
│   ├── dashboard/
│   │   └── PreparednessDashboard.tsx # Command center results dashboard
│   └── questionnaire/
│       ├── QuestionnaireModal.tsx    # Modal controller shell
│       ├── ProgressBar.tsx           # Component tracking questionnaire steps
│       ├── StepLocation.tsx          # Step 1 input panel
│       ├── StepAudience.tsx          # Step 2 target selector
│       ├── StepHousehold.tsx         # Step 3 dependency checks
│       ├── StepHousing.tsx           # Step 4 structural types
│       ├── StepTransport.tsx         # Step 5 transit modes
│       ├── StepLanguage.tsx          # Step 6 language selection
│       ├── StepSummary.tsx           # Step 7 summary logs
│       ├── types.ts                  # Local form types
│       ├── constants.ts              # Default states & loading lines
│       └── validation.ts             # Modular step validation rules
├── services/
│   └── gemini.ts                # Lightweight client fetch service wrapper
├── types/
│   └── planner.ts               # Global command contracts & unified schemas
└── utils/
    └── pdfGenerator.ts          # Client-side multi-page A4 PDF builder
```

---

## Setup Instructions

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Secure Server-Side Gemini Configuration (Hides from browser packages)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Target Model Identifier (Optional, defaults to gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash
```

### How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
3. **Compile Production Bundle**:
   ```bash
   npm run build
   ```

### Deployment

This project is fully ready for deployment on **Vercel** or other Next.js-compatible hosting platforms. Make sure to define `GEMINI_API_KEY` inside your environment variables in the deployment dashboard settings.

---

## Future Improvements

- **Meteorological API Integration**: Wire real-time geolocation coordinates to OpenWeather or local weather bureaus to pull current forecasts.
- **SMS Broadcasting**: Implement Twilio gateways to broadcast customized preparedness checkmarks as offline text alerts before storms hit.
- **PWA Offlining**: Cache current plan states in IndexedDB using Service Workers to allow full dashboard interaction even when local telecom grids fail.

---

## Acknowledgements

- Built for **Hack2Skill PromptWars** using **Google Gemini**.
- Designed by **Antigravity AI**.
