export const resumeSeed = {
  profile: {
    name: 'Devansh Sharma',
    role: 'Frontend Developer',
    email: 'devansh@example.com',
    phone: '+91 98765 43210',
    location: 'India',
    links: 'linkedin.com/in/devansh | github.com/devansh | devansh.dev',
    summary:
      'Frontend developer focused on building fast, accessible, and responsive web applications with React, JavaScript, TypeScript, and modern UI systems.',
  },
  experience: [
    {
      title: 'Frontend Developer Intern',
      company: 'PixelForge Labs',
      location: 'Remote',
      dates: 'Jan 2026 - Jun 2026',
      bullets:
        'Built reusable React components that reduced duplicate UI code by 35% across dashboard screens.\nImproved page load performance by 28% through asset optimization and code splitting.\nCollaborated with designers and backend engineers to ship responsive workflows for 2,000+ monthly users.',
    },
  ],
  projects: [
    {
      name: 'AI Resume Builder',
      stack: 'React, Vite, Framer Motion, CSS',
      link: 'github.com/devansh/ai-resume-builder',
      bullets:
        'Created a live resume editor with animated preview, ATS scoring, keyword matching, and PDF export flow.\nDesigned reusable form sections, dynamic project entries, template switching, and localStorage persistence.\nImplemented responsive layouts, empty states, and accessible controls for mobile and desktop users.',
    },
    {
      name: 'Analytics Dashboard',
      stack: 'React, Charts, REST APIs, Zustand',
      link: 'github.com/devansh/analytics-dashboard',
      bullets:
        'Developed interactive KPI cards, filters, charts, and sortable tables for product analytics.\nAdded loading, empty, and error states to improve reliability during slow API responses.\nStructured UI state to keep dashboard filters, table sorting, and chart selections predictable.',
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      school: 'ABC Institute of Technology',
      location: 'India',
      dates: '2022 - 2026',
      details: 'Relevant coursework: Data Structures, Web Development, DBMS, Operating Systems',
    },
  ],
  skills:
    'React, JavaScript, TypeScript, HTML, CSS, Tailwind CSS, REST APIs, Git, Responsive Design, Accessibility, Performance Optimization',
  certifications: 'Meta Front-End Developer Certificate\nJavaScript Algorithms and Data Structures',
  achievements:
    'Built 5+ production-style frontend projects\nSolved 250+ DSA problems\nContributed reusable components to open-source repositories',
  settings: {
    template: 'modern',
    accent: '#2563eb',
  },
}
