Live demo,Vercel link:
https://magic-sage.vercel.app/


Demo Video:
https://drive.google.com/file/d/15pAHtPxs3F3LYyJayoCMY6UOH4Jc7d1z/view?usp=drive_link



RecipeCraft:
AI-powered recipe generator with secure authentication.

Key Features:
Passwordless magic link login

AI-generated recipes using GroqCloud API with Llama 3 model

Customizable recipe preferences (cuisine, dietary needs, skill level)

Clean, responsive interface with smooth animations

How It Works
AI Backend:

Uses n8n workflow(deployed on Railway) connected to GroqCloud's Llama 3 model

Processes user inputs to generate tailored recipes

API endpoint: https://primary-production-03db.up.railway.app/webhook/rec

Frontend:

Next.js with Supabase authentication

Multi-step form for recipe preferences

Animated transitions between screens

Setup
Install dependencies:

bash
npm install
Create .env.local with:

text
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
Run development server:

bash
npm run dev
Deployment
Push to Vercel:

bash
vercel
Set the same environment variables in your Vercel project settings.

Technical Notes
Authentication handled by Supabase

State management with Zustand

Form data persists across steps

Recipe output formatted for easy reading

