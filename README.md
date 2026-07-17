# AI Resume Builder

AI Resume Builder is a React + Vite frontend project that helps users create, improve, preview, and export an interview-ready resume directly in the browser.

Live site:

```text
https://Damon-s789.github.io/ai-resume-builder/
```

## Project Overview

This project is built as a portfolio-friendly frontend application. It focuses on the kind of features interviewers like to see: clean UI, reusable React state, form-heavy workflows, live preview, smart content improvement, responsive design, local persistence, and deployment.

The app does not need a backend. Resume data is saved in the browser using LocalStorage, so users can edit their resume and keep their progress on the same device.

## Key Features

- Resume editor with sections for profile, experience, projects, education, and skills
- Live resume preview that updates as the user types
- Coach section for resume quality feedback
- CV improvement suggestions based on missing resume details and job description gaps
- Job description keyword matching
- Smart actions for improving summary, project bullets, and job keywords
- Multiple resume templates
- Accent color customization
- Dark mode
- JSON import/export for saving resume data
- Print or save as PDF using the browser print dialog
- Responsive layout for desktop and mobile
- GitHub Pages deployment through a `gh-pages` branch

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Framer Motion
- Lucide React icons
- LocalStorage
- GitHub Pages

## Why This Project Is Interview Friendly

- Shows strong React state management across a real form-based application
- Includes practical UI features instead of only a static landing page
- Demonstrates live preview logic and reusable rendering components
- Uses client-side persistence with LocalStorage
- Includes user-focused features like import/export, PDF printing, and job matching
- Has a complete deployment flow with GitHub Pages

## Folder Structure

```text
ai-resume-builder/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── scripts/
│   └── deploy-gh-pages.ps1
├── src/
│   ├── assets/
│   ├── data/
│   │   └── resumeSeed.js
│   ├── utils/
│   │   └── resumeTools.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Run Locally

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Build

Create a production build:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## GitHub Deployment

This project uses the simpler `gh-pages` branch deployment approach. It does not depend on GitHub Actions.

### 1. Create Repository

Create a public GitHub repository named:

```text
ai-resume-builder
```

Repository URL:

```text
https://github.com/Damon-s789/ai-resume-builder.git
```

### 2. Push Main Code

Run these commands from the project folder:

```powershell
cd C:\Users\Devansh\Desktop\ai-resume-builder

git remote set-url origin https://github.com/Damon-s789/ai-resume-builder.git
git branch -M main
git add .
git commit -m "Add AI resume builder"
git push -u origin main
```

If Git says there is nothing to commit, run:

```powershell
git push -u origin main
```

### 3. Deploy To GitHub Pages

Run:

```powershell
npm run deploy
```

This command will:

- Build the project
- Copy the production files from `dist`
- Create or update a `gh-pages` branch
- Push the deployed site files to GitHub

### 4. Enable GitHub Pages

Open repository settings:

```text
Settings -> Pages
```

Set:

```text
Source: Deploy from a branch
Branch: gh-pages
Folder: / (root)
```

Save the settings.

After a short wait, the app will be available at:

```text
https://Damon-s789.github.io/ai-resume-builder/
```

## Deployment Troubleshooting

If the site shows 404:

- Make sure the repository name is exactly `ai-resume-builder`
- Make sure the `gh-pages` branch exists on GitHub
- Make sure GitHub Pages source is set to `Deploy from a branch`
- Make sure the selected branch is `gh-pages` and folder is `/ (root)`
- Wait 1-2 minutes after saving Pages settings

If Git shows a safe directory error:

```powershell
git config --global --add safe.directory C:/Users/Devansh/Desktop/ai-resume-builder
```

If `npm run deploy` asks for GitHub login, complete the login and run the command again.
