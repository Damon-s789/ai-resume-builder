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
