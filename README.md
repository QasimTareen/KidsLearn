# KidsLearn Platform

An AI-powered kids learning platform built with React, TypeScript, Firebase, and Vite.

## Tech Stack
- React 19 + TypeScript
- Firebase (Auth + Firestore)
- YouTube Data API v3
- Google Gemini AI
- Tailwind CSS v4
- Vite

## Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/kidslearn-platform.git
   cd kidslearn-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then fill in your actual keys in `.env`.

4. **Run the dev server**
   ```bash
   npm run dev
   ```

## Deploying to Vercel

1. Push this repo to GitHub (`.env` is gitignored — never pushed).
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Vercel auto-detects Vite. Leave build settings as default.
4. Add all `VITE_*` variables from `.env.example` under **Settings → Environment Variables** in Vercel dashboard.
5. Add your Vercel domain to Firebase Console → Authentication → Authorized Domains.
6. Deploy!

## Environment Variables

See `.env.example` for all required variables. All Firebase and YouTube keys must be prefixed with `VITE_` to be available in the client build.

## Firebase Setup
- Enable **Authentication** (Email/Password)
- Enable **Firestore Database**
- Add your deployment domain to Authorized Domains in Firebase Auth settings
