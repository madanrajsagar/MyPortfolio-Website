import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      default: 'dark',
      enum: ['light', 'dark', 'system'],
    },
    aiAssistantPrompt: {
      type: String,
      default: 'You are an AI assistant helping recruiters evaluate Madanraj\'s portfolio. Highlight his achievements, skills, and projects.',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    websiteTitle: {
      type: String,
      default: 'Madanraj | AI & ML Engineer & MERN Developer',
    },
    websiteDescription: {
      type: String,
      default: 'Personal Brand and Portfolio Platform of Madanraj, showcasing CSE expertise, AI/ML engineering, and MERN stack applications.',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    themeColors: {
      primary: { type: String, default: '#6366f1' }, // indigo
      secondary: { type: String, default: '#ec4899' }, // pink
      accent: { type: String, default: '#8b5cf6' }, // violet
    },
    fonts: {
      display: { type: String, default: 'Space Grotesk' },
      body: { type: String, default: 'Inter' },
    },
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      blogs: { type: Boolean, default: true },
      gallery: { type: Boolean, default: true },
      certificates: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },
    homeHero: {
      title: { type: String, default: "Hello, I'm" },
      name: { type: String, default: 'Madanraj' },
      subtitle: { type: String, default: 'AI & ML Engineer / Full Stack MERN Developer' },
      typingText: { 
        type: [String], 
        default: ['AI & ML Engineer', 'Full Stack Developer', 'Competitive Programmer', 'GDG Lead'] 
      },
      description: { 
        type: String, 
        default: 'I build premium web applications, design scalable AI/ML pipelines, and lead technical developer communities.' 
      },
      profileImage: { type: String, default: '' },
      bgVideo: { type: String, default: '' },
      ctaText: { type: String, default: 'View Projects' },
      ctaLink: { type: String, default: '#projects' },
      ctaSecondaryText: { type: String, default: 'Contact Me' },
      ctaSecondaryLink: { type: String, default: '#contact' },
    },
    aboutMe: {
      paragraphs: {
        type: [String],
        default: [
          'I am currently pursuing my B.Tech in Computer Science and Engineering from Walchand College of Engineering, building upon a strong foundation from my Diploma in Computer Engineering at Government Polytechnic Sakoli.',
          'With a strong passion for Artificial Intelligence, Machine Learning, and Full-Stack MERN Development, I enjoy crafting high-performance user interfaces and integrating intelligent LLM components.',
          'As a GDG Chapter Leader and Competitive Programmer, I enjoy anchoring events, solving algorithmic challenges, and working on impactful software projects.'
        ]
      },
      journey: { type: String, default: '' },
      vision: { type: String, default: 'To research and deploy state-of-the-art AI models that automate and enrich web experiences.' },
      mission: { type: String, default: 'To deliver exceptionally crafted, secure, and performant web services using the MERN stack and prompt engineering workflows.' },
      goals: { type: String, default: 'Targeting Google, Amazon, or leading AI labs to solve massive computing challenges.' },
      interests: { type: [String], default: ['Machine Learning', 'DSA', 'Public Speaking', 'System Design'] },
    },
    contactDetails: {
      email: { type: String, default: 'madanrajsagar83@gmail.com' },
      phone: { type: String, default: '' },
      address: { type: String, default: 'Walchand College of Engineering, Sangli, Maharashtra, India' },
      googleMapIframe: { type: String, default: '' },
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      leetcode: { type: String, default: 'https://leetcode.com' },
      codechef: { type: String, default: 'https://codechef.com' },
      gfg: { type: String, default: 'https://geeksforgeeks.org' },
      email: { type: String, default: 'madanrajsagar83@gmail.com' },
    },
    footerText: {
      type: String,
      default: 'Built with the MERN Stack, Groq Llama 3.3, and Tailwind CSS.',
    },
    copyrightText: {
      type: String,
      default: '© 2026 Madanraj. All rights reserved.',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
