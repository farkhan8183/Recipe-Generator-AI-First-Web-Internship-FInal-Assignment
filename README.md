Vercel link:
https://magic-sage.vercel.app/










Demo Video:
https://drive.google.com/file/d/15pAHtPxs3F3LYyJayoCMY6UOH4Jc7d1z/view?usp=drive_link



RecipeCraft:
AI-powered recipe generator with secure authentication.

Tech Stack:

>> Next.js + Supabase for full-stack development

>> Tailwind CSS for styling

>> Zustand for advanced state management

>> Integrated LLM via n8n (self-hosted on Railway) to  integrate Llama 3 (70B) for recipe generation!

>> Magic link "Login" using Supabase.

Core Feature( AI + n8n Integration):

LLM-Powered Backend: AI logic is fully managed by an n8n workflow that sends input to LLaMA 3 (70B).

Self-Hosted Workflow: n8n is deployed on Railway with custom HTTP Webhook endpoints.

Seamless Integration: Frontend form data is sent via HTTP request to n8n, which processes and returns the AI-generated recipe.

Scalable Setup: Easy to plug in other LLMs or custom prompts in the same n8n workflow.

Technical Notes:



Authentication is managed entirely through Supabase’s Magic Link auth

Zustand is used for efficient state control across pages

Advanced animations for modern UI+
Data and form persistence for smooth UX

LLM response formatted and presented clearly to user!

