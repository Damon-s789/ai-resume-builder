# AI Resume Builder

Live demo: https://Damon-s789.github.io/ai-resume-builder/

A polished React + Vite frontend project for creating interview-ready resumes. It includes animated UI, live resume preview, templates, ATS-style scoring, job-description keyword matching, smart suggestions, JSON import/export, dark mode, and PDF printing.

## Features

- React + Vite app with clean component/state structure
- Framer Motion animations
- Live resume editor and preview
- Modern, Classic, and Compact resume templates
- Accent color customization
- ATS-style readiness score
- Job description keyword matcher
- Smart summary and bullet suggestions
- LocalStorage auto-save
- JSON import/export
- Print / Save as PDF
- Dark mode
- Responsive mobile tabs
- GitHub Pages workflow included

## Run In Browser

```powershell
cd "C:\Users\Devansh\Desktop\ai-resume-builder"
npm.cmd run dev
```

Keep that terminal open, then open:

```txt
http://127.0.0.1:5173/
```

You can also double-click `START_VITE.bat`.

## Build

```powershell
npm.cmd run build
```

## Deploy To GitHub Pages

This repo includes a GitHub Actions workflow that publishes the Vite `dist` build to GitHub Pages.

1. Create a GitHub repository named `ai-resume-builder`.
2. Push this project to the `main` branch.
3. Open GitHub repo settings.
4. Go to `Pages`.
5. Set source to `GitHub Actions`.
6. The deploy workflow will publish the app at:

```txt
https://Damon-s789.github.io/ai-resume-builder/
```

```powershell
git init
git add .
git commit -m "Add AI resume builder"
git branch -M main
git remote add origin https://github.com/Damon-s789/ai-resume-builder.git
git push -u origin main
```
