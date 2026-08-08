/**
 * seed.js — Portfolio Data Seeder
 *
 * Uploads local images to Cloudinary and inserts all hardcoded portfolio
 * data (achievements, projects, skills, experiences, education, certificates)
 * into MongoDB.
 *
 * Usage: node seed.js
 * Run from: server/ directory
 *
 * Idempotent: each collection is only seeded if it currently has 0 documents.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

// ── Models ─────────────────────────────────────────────────────────────────
import Achievement from './models/Achievement.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Experience from './models/Experience.js';
import Education from './models/Education.js';
import Certificate from './models/Certificate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Cloudinary setup ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Public folder of the client (where /portfolio/... images live)
const CLIENT_PUBLIC = path.join(__dirname, '..', 'client', 'public');

/**
 * Upload a local file (relative to client/public/) to Cloudinary.
 * Returns the secure_url on success, or the original local path on failure.
 */
async function uploadToCloudinary(localPath, folder) {
  const absolutePath = path.join(CLIENT_PUBLIC, localPath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ File not found, skipping: ${absolutePath}`);
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: `madanraj_portfolio/${folder}`,
      resource_type: 'auto',
    });
    console.log(`  ✓ Uploaded: ${localPath} → ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ✗ Cloudinary upload failed for ${localPath}:`, err.message);
    return null;
  }
}

/**
 * Upload an array of local image paths and return an array of Cloudinary URLs.
 * Null entries are filtered out.
 */
async function uploadMany(paths, folder) {
  const urls = [];
  for (const p of paths) {
    const url = await uploadToCloudinary(p, folder);
    if (url) urls.push(url);
  }
  return urls;
}

import dns from 'dns';

// Force Node's DNS resolver to resolve IPv4 addresses first.
dns.setDefaultResultOrder('ipv4first');

// Programmatically use Google and Cloudflare DNS servers for resolving queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Programmatic DNS override active: Routing lookups through 8.8.8.8 and 1.1.1.1');
} catch (e) {
  console.warn('Programmatic DNS setServers failed, falling back to OS settings:', e.message);
}

// ── Connect to MongoDB ───────────────────────────────────────────────────────
async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected\n');
}

// ════════════════════════════════════════════════════════════════════════════
// SEED — ACHIEVEMENTS
// ════════════════════════════════════════════════════════════════════════════
async function seedAchievements() {
  console.log('🏆 Seeding Achievements...');
  await Achievement.deleteMany({});
  console.log('  Cleared existing Achievements.');

  const data = [
    {
      order: 1,
      title: 'HackoutSav',
      position: '🥈 1st Runner-Up',
      positionLabel: '2nd Place (₹15,000 Prize)',
      category: 'National Hackathon',
      badge: 'silver',
      date: '2024',
      description: 'Secured 1st Runner-Up at the national-level HackoutSav hackathon, one of the most competitive inter-college events in Maharashtra. Built a full-stack solution addressing a real-world problem within 24 hours.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
      contribution: 'Led the full-stack development end-to-end — architected the backend REST API, designed the React UI, and integrated MongoDB within the hackathon timeline.',
      highlights: [
        'Competed against 100+ teams from across Maharashtra',
        'Delivered a production-ready prototype in 24 hours',
        'Judged on innovation, technical depth, and presentation',
        'Won cash prize and national recognition',
      ],
      localImages: [
        '/portfolio/achievements/hackoutsav/1.jpg',
        '/portfolio/achievements/hackoutsav/2.jpg',
        '/portfolio/achievements/hackoutsav/3.jpg',
        '/portfolio/achievements/hackoutsav/4.jpg',
        '/portfolio/achievements/hackoutsav/5.jpg',
      ],
    },
    {
      order: 2,
      title: 'AI Prompt Battle Competition',
      position: '🥇 Winner',
      positionLabel: '1st Place',
      category: 'AI Competition',
      badge: 'gold',
      date: '2024',
      description: 'Secured 1st place in the AI Prompt Battle Competition, demonstrating speed and precision in crafting optimized prompts for LLMs across creative writing, code generation, and logic reasoning scenarios.',
      technologies: ['Prompt Engineering', 'LLMs', 'OpenAI', 'ChatGPT', 'Ollama'],
      contribution: 'Designed and iterated advanced prompt structures in real-time under competition conditions, leveraging expertise in chain-of-thought and few-shot prompting techniques.',
      highlights: [
        'Competed against AI/ML enthusiasts across multiple colleges',
        'Demonstrated mastery of LLM instruction and output optimization',
        'Awarded for fastest, most accurate, and creative prompt outputs',
        'Showcased practical knowledge of generative AI tools',
      ],
      localImages: [
        '/portfolio/achievements/ai-prompt-battle/1.jpg',
        '/portfolio/achievements/ai-prompt-battle/2.jpg',
        '/portfolio/achievements/ai-prompt-battle/3.jpg',
      ],
    },
    {
      order: 3,
      title: 'Techno-Spirit',
      position: '🥇 Winner',
      positionLabel: '1st Place',
      category: 'Tech Fest Competition',
      badge: 'gold',
      date: '2024',
      description: 'Won the Techno-Spirit inter-collegiate technical competition, testing skills in software engineering, problem-solving, and rapid prototyping across multiple rounds.',
      technologies: ['JavaScript', 'React', 'Node.js', 'Algorithms'],
      contribution: 'Spearheaded the technical strategy and coding implementation for all competition rounds, ensuring efficient and innovative solutions for each challenge.',
      highlights: [
        'Multi-round competition with technical challenges',
        'Tested coding speed, algorithm design, and software architecture',
        'Represented Walchand College in inter-collegiate event',
        'Won certificate and recognition for excellence',
      ],
      localImages: [
        '/portfolio/achievements/techno-spirit/1.jpg',
        '/portfolio/achievements/techno-spirit/2.jpg',
        '/portfolio/achievements/techno-spirit/3.jpg',
      ],
    },
    {
      order: 4,
      title: 'Reimagine',
      position: '🏆 Top Performer',
      positionLabel: 'Winner',
      category: 'Innovation Challenge',
      badge: 'gold',
      date: '2024',
      description: 'Participated and excelled in the Reimagine innovation challenge — a competition focused on reimagining existing systems with modern technology and creative thinking.',
      technologies: ['React', 'AI/ML', 'UI/UX Design', 'Presentation'],
      contribution: 'Conceptualized and presented an innovative technical solution, combining design thinking with full-stack implementation to create a compelling reimagination of a real-world system.',
      highlights: [
        'Focused on creativity, innovation, and technical feasibility',
        'Required both a working prototype and compelling pitch',
        'Evaluated by industry mentors and faculty judges',
        'Recognized for most innovative and technically sound solution',
      ],
      localImages: [
        '/portfolio/achievements/reimagine/1.jpg',
      ],
    },
    {
      order: 5,
      title: 'College Topper & Government Scholarship',
      position: '🎓 Rank 1',
      positionLabel: 'Topper — 4 Consecutive Semesters',
      category: 'Academic Excellence',
      badge: 'platinum',
      date: '2020 – 2023',
      description: 'Achieved College Topper status for four consecutive semesters during Diploma in Computer Technology with 95.09% aggregate. Secured Maharashtra State Rank 330 and was awarded the Government Scholarship for academic excellence.',
      technologies: [],
      contribution: 'Maintained consistent rank 1 throughout the diploma program while also participating in technical events. Demonstrated strong fundamentals in computer science, mathematics, and electronics.',
      highlights: [
        '95.09% aggregate — College Topper across all semesters',
        'Maharashtra State Board (MSBTE) Rank: 330',
        'Government of Maharashtra Scholarship recipient',
        'Rank 1 for four consecutive semesters (2020–2023)',
        'Strong foundation that enabled B.Tech at Walchand College',
      ],
      localImages: [
        '/portfolio/achievements/college-topper/1.jpg',
        '/portfolio/achievements/college-topper/2.jpeg',
        '/portfolio/achievements/college-topper/3.jpg',
        '/portfolio/achievements/college-topper/4.jpeg',
      ],
    },
    {
      order: 6,
      title: 'Hacktoberfest',
      position: '✅ Completed',
      positionLabel: 'Contributor — 4+ PRs Merged',
      category: 'Open Source',
      badge: 'silver',
      date: '2023',
      description: 'Successfully completed Hacktoberfest by contributing to open source projects on GitHub. Merged 4+ pull requests across multiple repositories, contributing meaningful code and documentation improvements.',
      technologies: ['Git', 'GitHub', 'Open Source', 'JavaScript', 'Documentation'],
      contribution: 'Identified issues in open source projects, wrote clean code fixes, documented changes properly, and engaged with maintainers during the code review process.',
      highlights: [
        'Contributed to 4+ open source repositories',
        'All pull requests reviewed and merged by project maintainers',
        'Received Hacktoberfest digital badge and recognition',
        'Gained experience with real-world collaborative development workflows',
      ],
      localImages: [
        '/portfolio/achievements/hacktoberfest/1.jpg',
        '/portfolio/achievements/hacktoberfest/2.jpg',
        '/portfolio/achievements/hacktoberfest/3.jpg',
        '/portfolio/achievements/hacktoberfest/4.jpg',
      ],
    },
    {
      order: 7,
      title: 'CodeDash',
      position: '🏅 Participant',
      positionLabel: 'Top Performer',
      category: 'Coding Competition',
      badge: 'bronze',
      date: '2023',
      description: 'Participated in CodeDash, a high-intensity speed coding competition. Competed in timed algorithmic challenges requiring both speed and accuracy in problem solving.',
      technologies: ['Data Structures', 'Algorithms', 'Competitive Programming', 'Java/Python'],
      contribution: 'Applied advanced DSA knowledge to solve timed problems efficiently, demonstrating strong algorithmic thinking and quick code execution under competitive pressure.',
      highlights: [
        'Timed competitive programming event',
        'Challenges covered arrays, trees, graphs, and dynamic programming',
        'Ranked among top performers in the competition',
        'Strengthened competitive programming skills and LeetCode preparation',
      ],
      localImages: [
        '/portfolio/achievements/codedash/1.jpg',
      ],
    },
    {
      order: 8,
      title: 'National-Level Paper Presentation Competition',
      position: '🥇 1st Place',
      positionLabel: 'Winner — National Level',
      category: 'Research & Paper',
      badge: 'gold',
      date: '2023',
      description: 'Won 1st place in a National-Level Paper Presentation Competition. Presented original research on an emerging technology topic to a panel of academics and industry experts.',
      technologies: ['Research', 'AI/ML Concepts', 'Technical Writing', 'Presentation'],
      contribution: 'Independently researched the topic, authored the technical paper, prepared slides, and delivered a compelling presentation that impressed the expert judging panel.',
      highlights: [
        'Competed at national level among top engineering students',
        'Evaluated by academic researchers and industry professionals',
        'Paper demonstrated depth of technical knowledge and innovation',
        'Won 1st place with certificate and national recognition',
      ],
      localImages: [
        '/portfolio/achievements/national-paper/1.jpg',
        '/portfolio/achievements/national-paper/2.jpg',
        '/portfolio/achievements/national-paper/3.jpg',
      ],
    },
    {
      order: 9,
      title: 'State-Level Paper Presentation Competition',
      position: '🥇 1st Place',
      positionLabel: 'Winner — State Level',
      category: 'Research & Paper',
      badge: 'gold',
      date: '2022',
      description: 'Won 1st place in a State-Level Paper Presentation Competition, presenting original technical research to a panel of judges from academia and industry.',
      technologies: ['Research', 'Computer Science', 'Technical Writing', 'Public Speaking'],
      contribution: 'Authored and presented a well-structured technical paper. Demonstrated strong command of the subject, clear articulation of ideas, and effective response to questions from the panel.',
      highlights: [
        'State-level competition with participants across Maharashtra',
        'Judged on technical depth, clarity, originality, and presentation',
        'Won 1st place with certificate of excellence',
        'Built confidence in public speaking and technical communication',
      ],
      localImages: [
        '/portfolio/achievements/state-paper/1.jpg',
        '/portfolio/achievements/state-paper/2.jpg',
        '/portfolio/achievements/state-paper/3.jpg',
      ],
    },
  ];

  for (const item of data) {
    const { localImages, ...rest } = item;
    console.log(`  Uploading images for: ${rest.title}`);
    const photos = await uploadMany(localImages, 'achievements/photos');
    await Achievement.create({ ...rest, photos, status: 'published' });
    console.log(`  ✅ Created: ${rest.title}\n`);
  }

  console.log(`🏆 Achievements seeded: ${data.length} records\n`);
}

// ════════════════════════════════════════════════════════════════════════════
// SEED — PROJECTS
// ════════════════════════════════════════════════════════════════════════════
async function seedProjects() {
  console.log('📁 Seeding Projects...');
  await Project.deleteMany({});
  console.log('  Cleared existing Projects.');

  const data = [
    {
      order: 1,
      title: 'Abhaya',
      tagline: 'AI-Powered Women Safety Platform',
      category: 'AI / Full Stack',
      duration: '3 months',
      projectStatus: 'Completed',
      featured: true,
      description: 'An AI-powered women safety application combining real-time location tracking, emergency SOS alerts, and community reporting.',
      longDescription: 'Abhaya is a comprehensive women safety application that combines real-time location tracking, emergency SOS alerts, AI-driven risk assessment, and community reporting to empower users in unsafe situations.',
      problem: 'Women face significant safety risks with limited immediate response mechanisms. Existing solutions lack intelligent threat detection and real-time community alerting.',
      solution: 'Built a full-stack platform with a React frontend and Node.js backend that integrates AI for risk scoring, real-time WebSocket-based alerts, and automated SOS messaging to emergency contacts.',
      features: [
        'Real-time SOS alert system with automated contact notification',
        'AI-based risk assessment using location context and time patterns',
        'Community-driven safety zone mapping',
        'Live location sharing with trusted contacts',
        'Incident reporting with photo evidence and geolocation',
        'Panic button with multi-channel alert dispatch',
      ],
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Python', 'Machine Learning', 'Tailwind CSS'],
      architecture: ['MERN stack with real-time WebSocket communication. AI model runs on a Python microservice, integrated via REST API. MongoDB stores location history and incident reports with geospatial indexing.'],
      challenges: 'Implementing reliable real-time location tracking with minimal battery drain; designing the AI risk model with sufficient accuracy; ensuring sub-second alert delivery under high-load conditions.',
      contribution: 'Led full-stack development — designed the MongoDB schema, built the Express REST APIs, implemented Socket.io real-time communication, and developed the React UI with mobile-first design.',
      githubLink: 'https://github.com/madanrajsagar/Abhaya',
      responsive: true,
      localImages: [],
    },
    {
      order: 2,
      title: 'TravelNest',
      tagline: 'Premium MERN Travel Booking Platform',
      category: 'Full Stack / MERN',
      duration: '4 months',
      projectStatus: 'Completed',
      featured: true,
      description: 'A full-featured travel booking and trip planning platform built on the MERN stack.',
      longDescription: 'TravelNest is a full-featured travel booking and trip planning platform built on the MERN stack. It supports dynamic destination discovery, room/package bookings, map integration, and secure user authentication.',
      problem: 'Travel booking platforms often lack personalization and mobile-friendly design, leading to poor user experience and abandoned bookings.',
      solution: 'Built a premium MERN application with an intuitive booking flow, interactive map-based destination browsing, JWT-secured sessions, and a responsive design that works flawlessly on all devices.',
      features: [
        'Dynamic destination discovery with map-based exploration',
        'Room and travel package booking with availability management',
        'Secure JWT authentication with refresh token rotation',
        'Admin dashboard for booking management and analytics',
        'Real-time availability checking and booking confirmation',
        'Responsive mobile-first design with smooth animations',
        'Filter, sort, and search across all destinations and packages',
      ],
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT', 'Leaflet Maps', 'Framer Motion'],
      architecture: ['Standard MERN architecture with React frontend served via Vite. Node.js/Express backend with RESTful API design. MongoDB Atlas for cloud database with Mongoose ODM. JWT-based auth with HTTP-only cookies.'],
      challenges: 'Building a real-time availability system that handles concurrent bookings without race conditions; implementing complex filtering across multiple dimensions; optimizing image loading for slow connections.',
      contribution: 'Architected and built the entire platform solo — from MongoDB schema design and Express API development to React component architecture and Tailwind CSS styling. Integrated maps, booking logic, and the admin dashboard.',
      githubLink: 'https://github.com/madanrajsagar/TravelNest',
      liveDemo: 'https://travel-nest-delta-indol.vercel.app/listings',
      responsive: true,
      localImages: [
        '/portfolio/projects/travelnest/1.png',
        '/portfolio/projects/travelnest/2.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 024509.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 024528.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 024619.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 024648.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 024721.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 025127.png',
        '/portfolio/projects/travelnest/Screenshot 2026-08-05 025347.png',
      ],
    },
    {
      order: 3,
      title: 'Government OBC Hostel Website',
      tagline: 'Official Government Institution Web Portal',
      category: 'Full Stack / Government',
      duration: '2 months',
      projectStatus: 'Live',
      featured: true,
      description: 'An official web portal for a Government OBC Hostel to digitize hostel management and serve the student community online.',
      longDescription: 'An official web portal developed for a Government OBC Hostel to digitize hostel management, provide facility information, handle admission inquiries, and serve the student community online.',
      problem: 'The hostel had no digital presence. All information was paper-based, causing delays in communication with students and guardians.',
      solution: 'Built a professional, accessible government web portal with a clean UI, multilingual content support, online inquiry form, facility gallery, and an admin panel for content management.',
      features: [
        'Professional government portal UI with accessibility standards',
        'Online admission inquiry and application form',
        'Facility and amenity information pages',
        'Photo gallery with hostel infrastructure',
        'Admin panel for managing announcements and admissions',
        'Responsive design for mobile users (students on phones)',
        'Contact and grievance submission form',
      ],
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Government Design Standards'],
      architecture: ['MERN stack with a focus on accessibility, fast page loads, and SEO for government search ranking. MongoDB for storing inquiry forms and announcements.'],
      challenges: 'Meeting government accessibility and design standards while keeping the UI modern; building multilingual content support; ensuring fast load times for rural users on slow connections.',
      contribution: 'Sole developer — designed the information architecture, built all pages, implemented the admin CMS, and deployed the platform for the government institution.',
      githubLink: 'https://github.com/harshadbk/Government_OBC_VJNT_Hostel_Prod.git',
      liveDemo: 'https://www.hostelmanagement.online/',
      responsive: true,
      localImages: [],
    },
    {
      order: 4,
      title: 'MSBTE Navigator',
      tagline: 'Study Resource Hub for Diploma Students',
      category: 'Full Stack / Education',
      duration: '2.5 months',
      projectStatus: 'Live',
      featured: false,
      description: 'A comprehensive study resource platform for MSBTE diploma curriculum students.',
      longDescription: 'MSBTE Navigator is a comprehensive study resource platform for MSBTE diploma curriculum students. It aggregates PDFs, question papers, video resources, and subject notes organized by semester, branch, and subject.',
      problem: 'MSBTE diploma students struggled to find organized study material. Resources were scattered across drives, Telegram groups, and websites with no centralized, searchable platform.',
      solution: 'Built a searchable resource hub where students can browse by branch, semester, and subject. Features PDF preview, Google Drive integration, and a contribution mechanism for community-driven content.',
      features: [
        'Full-text search across all subjects, semesters, and branches',
        'PDF preview with Google Drive integration',
        'Organized by Branch → Semester → Subject hierarchy',
        'Community contribution system for adding new resources',
        'Bookmark and save favorite resources',
        'Mobile-optimized for students using smartphones',
        'Admin panel for content moderation and upload management',
      ],
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'Google Drive API', 'JWT'],
      architecture: ['MERN stack with Google Drive API integration for PDF storage. MongoDB stores metadata for resources. React frontend with Bootstrap for rapid, clean UI development.'],
      challenges: 'Designing the search algorithm to handle fuzzy matching across subject names and codes; managing large PDF files efficiently without server storage costs; building a moderation system for community contributions.',
      contribution: 'Designed the database schema for the resource hierarchy, built the search system with MongoDB text indexing, developed the Google Drive integration, and created the student-facing React UI.',
      githubLink: 'https://github.com/madanrajsagar/MsbteNavigator',
      responsive: true,
      localImages: [
        '/portfolio/projects/msbte/Picture1.png',
        '/portfolio/projects/msbte/Picture2.png',
        '/portfolio/projects/msbte/Picture3.png',
        '/portfolio/projects/msbte/Picture4.png',
      ],
    },
  ];

  for (const item of data) {
    const { localImages, ...rest } = item;
    console.log(`  Uploading images for: ${rest.title}`);
    const gallery = await uploadMany(localImages, 'projects');
    const heroImage = gallery.length > 0 ? gallery[0] : '';
    await Project.create({ ...rest, heroImage, gallery, status: 'published' });
    console.log(`  ✅ Created: ${rest.title}\n`);
  }

  console.log(`📁 Projects seeded: ${data.length} records\n`);
}

// ════════════════════════════════════════════════════════════════════════════
// SEED — SKILLS
// ════════════════════════════════════════════════════════════════════════════
async function seedSkills() {
  const count = await Skill.countDocuments({ status: { $ne: 'deleted' } });
  if (count > 0) {
    console.log(`⏭  Skills already seeded (${count} records). Skipping.\n`);
    return;
  }

  console.log('🔧 Seeding Skills...');

  const skills = [
    // Programming Languages
    { name: 'Java', category: 'Programming Languages', proficiency: 88, experienceYears: 3, level: 'Advanced', emoji: '☕', color: 'red', order: 1 },
    { name: 'Python', category: 'Programming Languages', proficiency: 90, experienceYears: 3, level: 'Advanced', emoji: '🐍', color: 'blue', order: 2 },
    { name: 'JavaScript', category: 'Programming Languages', proficiency: 92, experienceYears: 3, level: 'Expert', emoji: 'JS', color: 'yellow', order: 3 },
    { name: 'TypeScript', category: 'Programming Languages', proficiency: 80, experienceYears: 2, level: 'Advanced', emoji: 'TS', color: 'blue', order: 4 },
    { name: 'C / C++', category: 'Programming Languages', proficiency: 78, experienceYears: 3, level: 'Intermediate', emoji: '⚡', color: 'violet', order: 5 },
    // Frontend
    { name: 'React.js', category: 'Frontend Development', proficiency: 92, experienceYears: 3, level: 'Expert', emoji: '⚛️', color: 'sky', order: 6 },
    { name: 'Tailwind CSS', category: 'Frontend Development', proficiency: 95, experienceYears: 2, level: 'Expert', emoji: '🎨', color: 'cyan', order: 7 },
    { name: 'HTML5 / CSS3', category: 'Frontend Development', proficiency: 95, experienceYears: 4, level: 'Expert', emoji: '🌐', color: 'orange', order: 8 },
    { name: 'Vite', category: 'Frontend Development', proficiency: 85, experienceYears: 2, level: 'Advanced', emoji: '⚡', color: 'violet', order: 9 },
    { name: 'Framer Motion', category: 'Frontend Development', proficiency: 80, experienceYears: 1.5, level: 'Advanced', emoji: '🎞️', color: 'pink', order: 10 },
    // Backend
    { name: 'Node.js', category: 'Backend Development', proficiency: 88, experienceYears: 2.5, level: 'Advanced', emoji: '🟢', color: 'emerald', order: 11 },
    { name: 'Express.js', category: 'Backend Development', proficiency: 90, experienceYears: 2.5, level: 'Advanced', emoji: 'Ex', color: 'gray', order: 12 },
    { name: 'REST APIs', category: 'Backend Development', proficiency: 90, experienceYears: 2.5, level: 'Expert', emoji: '🔗', color: 'indigo', order: 13 },
    { name: 'JWT / Auth', category: 'Backend Development', proficiency: 85, experienceYears: 2, level: 'Advanced', emoji: '🔐', color: 'emerald', order: 14 },
    // Databases
    { name: 'MongoDB', category: 'Database Technologies', proficiency: 88, experienceYears: 2.5, level: 'Advanced', emoji: '🍃', color: 'emerald', order: 15 },
    { name: 'MySQL', category: 'Database Technologies', proficiency: 85, experienceYears: 3, level: 'Advanced', emoji: '🐬', color: 'amber', order: 16 },
    { name: 'Oracle SQL', category: 'Database Technologies', proficiency: 75, experienceYears: 2, level: 'Intermediate', emoji: '🔴', color: 'red', order: 17 },
    { name: 'Vector DBs', category: 'Database Technologies', proficiency: 75, experienceYears: 1, level: 'Intermediate', emoji: '🗂️', color: 'violet', order: 18 },
    // AI & ML
    { name: 'Machine Learning', category: 'Artificial Intelligence & Machine Learning', proficiency: 80, experienceYears: 2, level: 'Advanced', emoji: '🤖', color: 'pink', order: 19 },
    { name: 'LangChain', category: 'Artificial Intelligence & Machine Learning', proficiency: 85, experienceYears: 1.5, level: 'Advanced', emoji: '🔗', color: 'pink', order: 20 },
    { name: 'Ollama (Local LLMs)', category: 'Artificial Intelligence & Machine Learning', proficiency: 88, experienceYears: 1.5, level: 'Advanced', emoji: '🧠', color: 'violet', order: 21 },
    { name: 'RAG Architecture', category: 'Artificial Intelligence & Machine Learning', proficiency: 82, experienceYears: 1.5, level: 'Advanced', emoji: '📚', color: 'indigo', order: 22 },
    { name: 'Prompt Engineering', category: 'Artificial Intelligence & Machine Learning', proficiency: 92, experienceYears: 2, level: 'Expert', emoji: '💡', color: 'amber', order: 23 },
    // DevOps & Cloud
    { name: 'AWS Cloud', category: 'DevOps & Cloud', proficiency: 70, experienceYears: 1.5, level: 'Intermediate', emoji: '☁️', color: 'orange', order: 24 },
    { name: 'Firebase', category: 'DevOps & Cloud', proficiency: 85, experienceYears: 2, level: 'Advanced', emoji: '🔥', color: 'amber', order: 25 },
    { name: 'Vercel / Netlify', category: 'DevOps & Cloud', proficiency: 88, experienceYears: 2, level: 'Advanced', emoji: '▲', color: 'gray', order: 26 },
    { name: 'Docker', category: 'DevOps & Cloud', proficiency: 75, experienceYears: 1, level: 'Intermediate', emoji: '🐳', color: 'sky', order: 27 },
    { name: 'Git & GitHub Actions', category: 'DevOps & Cloud', proficiency: 82, experienceYears: 2, level: 'Advanced', emoji: '🐙', color: 'orange', order: 28 },
    { name: 'CI/CD Pipelines', category: 'DevOps & Cloud', proficiency: 70, experienceYears: 1.5, level: 'Intermediate', emoji: '🔄', color: 'indigo', order: 29 },
    // Tools & Platforms
    { name: 'Postman', category: 'Tools & Platforms', proficiency: 90, experienceYears: 2.5, level: 'Expert', emoji: '📮', color: 'orange', order: 30 },
    { name: 'VS Code', category: 'Tools & Platforms', proficiency: 95, experienceYears: 4, level: 'Expert', emoji: '💻', color: 'blue', order: 31 },
    { name: 'Linux CLI', category: 'Tools & Platforms', proficiency: 80, experienceYears: 2, level: 'Advanced', emoji: '🐚', color: 'gray', order: 32 },
    // Data Visualization (mapped to Core CS from frontend)
    { name: 'Data Structures & Algorithms', category: 'Data Visualization', proficiency: 88, experienceYears: 3, level: 'Advanced', emoji: '📈', color: 'indigo', order: 33 },
    { name: 'Object-Oriented Programming', category: 'Data Visualization', proficiency: 90, experienceYears: 3, level: 'Expert', emoji: '🧱', color: 'violet', order: 34 },
    { name: 'Database Management (DBMS)', category: 'Data Visualization', proficiency: 85, experienceYears: 2.5, level: 'Advanced', emoji: '🗄️', color: 'amber', order: 35 },
    { name: 'Computer Networks', category: 'Data Visualization', proficiency: 80, experienceYears: 2, level: 'Advanced', emoji: '🕸️', color: 'sky', order: 36 },
    { name: 'Operating Systems', category: 'Data Visualization', proficiency: 82, experienceYears: 2, level: 'Advanced', emoji: '💿', color: 'emerald', order: 37 },
  ];

  await Skill.insertMany(skills.map(s => ({ ...s, status: 'published' })));
  console.log(`🔧 Skills seeded: ${skills.length} records\n`);
}

// ════════════════════════════════════════════════════════════════════════════
// SEED — EXPERIENCE
// ════════════════════════════════════════════════════════════════════════════
async function seedExperience() {
  const count = await Experience.countDocuments({ status: { $ne: 'deleted' } });
  if (count > 0) {
    console.log(`⏭  Experience already seeded (${count} records). Skipping.\n`);
    return;
  }

  console.log('💼 Seeding Experience...');

  const experiences = [
    {
      order: 1,
      company: 'Google Developer Groups (GDG) On Campus',
      companyFull: 'GDG On Campus — Walchand College of Engineering',
      role: 'Assistant Secretary & Web Team Lead',
      type: 'Leadership',
      startDate: new Date('2023-09-01'),
      isCurrent: true,
      location: 'Walchand College of Engineering, Sangli',
      summary: 'Serving as Assistant Secretary and Web Team Lead at GDG On Campus, Walchand — one of the most active Google Developer Groups in Maharashtra. Responsible for coordinating technical events, managing community outreach, and leading the web development team.',
      description: [
        'Coordinate and execute state-level hackathons, tech workshops, and speaker sessions for 500+ participants per event',
        'Lead the web development team — building and maintaining the GDG chapter website using React and Vite',
        'Manage event logistics, registrations, venue coordination, and real-time communication pipelines',
        'Drive community outreach campaigns, growing GDG membership by 40% in one academic year',
        'Anchor public speaking sessions as an emcee and technical moderator for talks by industry professionals',
        'Mentor junior students in web development, competitive programming, and hackathon preparation',
        'Represent Walchand at regional GDG events and inter-college technical fests',
      ],
      highlights: [
        'Users|500+ participants per event',
        'Globe|40% membership growth',
        'Code2|Web portal development',
        'Megaphone|Public speaker & emcee',
      ],
      techStack: ['React', 'Vite', 'Tailwind CSS', 'Git/GitHub', 'Figma', 'Google Workspace'],
      color: 'indigo',
      status: 'published',
    },
    {
      order: 2,
      company: 'Walchand College ACM Student Chapter',
      companyFull: 'ACM Student Chapter — Walchand College of Engineering',
      role: 'Technical Coordinator',
      type: 'Volunteer',
      startDate: new Date('2022-10-01'),
      endDate: new Date('2023-06-01'),
      isCurrent: false,
      location: 'Walchand College of Engineering, Sangli',
      summary: 'Coordinated technical activities under the ACM Student Chapter, organizing DSA mentoring sessions and competitive programming challenges for undergraduate students.',
      description: [
        'Organized weekly coding challenges and algorithmic problem-solving sessions for 100+ students',
        'Developed and distributed DSA study resources and competitive programming guides for freshmen',
        'Assisted in running mock coding contests on platforms like HackerRank and CodeChef',
        'Mentored junior students transitioning from C/C++ to competitive Python and Java',
      ],
      highlights: [
        'Users|100+ students mentored',
        'Code2|DSA sessions organized',
        'Trophy|Coding contests managed',
      ],
      techStack: ['C++', 'Python', 'Java', 'Algorithms', 'Data Structures'],
      color: 'violet',
      status: 'published',
    },
  ];

  await Experience.insertMany(experiences);
  console.log(`💼 Experience seeded: ${experiences.length} records\n`);
}

// ════════════════════════════════════════════════════════════════════════════
// SEED — EDUCATION
// ════════════════════════════════════════════════════════════════════════════
async function seedEducation() {
  const count = await Education.countDocuments({ status: { $ne: 'deleted' } });
  if (count > 0) {
    console.log(`⏭  Education already seeded (${count} records). Skipping.\n`);
    return;
  }

  console.log('🎓 Seeding Education...');

  const educations = [
    {
      order: 1,
      institution: 'Walchand College of Engineering, Sangli',
      degree: 'B.Tech in Artificial Intelligence & Machine Learning',
      fieldOfStudy: 'Artificial Intelligence & Machine Learning',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2028-06-30'),
      cgpa: 9.29,
      currentYear: '2025 – 2028',
      highlight: 'btech',
      achievements: [
        'CGPA: 9.29',
        'Consistently strong academic performance',
        'Active involvement in GDG WCE and technical activities',
        'Building expertise in AI/ML, software development, and problem solving',
      ],
      status: 'published',
    },
    {
      order: 2,
      institution: 'Government Polytechnic Sakoli',
      degree: 'Diploma in Computer Technology',
      fieldOfStudy: 'Computer Technology',
      startDate: new Date('2022-08-01'),
      endDate: new Date('2025-06-30'),
      marks: 95.09,
      currentYear: '2022 – 2025',
      highlight: 'diploma',
      achievements: [
        '95.09% aggregate',
        'College Topper — Rank 1',
        'Maintained Rank 1 for four consecutive semesters',
        'Maharashtra State Board Rank: 330',
        'Developed a strong foundation in programming, computer science, and mathematics',
      ],
      status: 'published',
    },
  ];

  await Education.insertMany(educations);
  console.log(`🎓 Education seeded: ${educations.length} records\n`);
}

// ════════════════════════════════════════════════════════════════════════════
// SEED — CERTIFICATES
// ════════════════════════════════════════════════════════════════════════════
async function seedCertificates() {
  const count = await Certificate.countDocuments({ status: { $ne: 'deleted' } });
  if (count > 0) {
    console.log(`⏭  Certificates already seeded (${count} records). Skipping.\n`);
    return;
  }

  console.log('🏅 Seeding Certificates...');

  const certsData = [
    {
      order: 1,
      title: 'Postman API Student Expert',
      organization: 'Postman',
      issueDate: new Date('2024-01-01'),
      credentialId: 'POSTMAN-EX-102',
      category: 'APIs / Tools',
      localImage: '/portfolio/achievements/techno-spirit/2.jpg',
    },
    {
      order: 2,
      title: 'Python for Data Science & AI',
      organization: 'IBM / Coursera',
      issueDate: new Date('2023-06-01'),
      credentialId: 'IBM-PYAI-883',
      category: 'Data Science',
      localImage: '/portfolio/achievements/ai-prompt-battle/2.jpg',
    },
    {
      order: 3,
      title: 'React & Redux Professional Certification',
      organization: 'Udemy Academic',
      issueDate: new Date('2023-09-01'),
      credentialId: 'UDEMY-RX-7749',
      category: 'Frontend Development',
      localImage: '/portfolio/achievements/reimagine/1.jpg',
    },
    {
      order: 4,
      title: 'AWS Academy Graduate – Cloud Foundations',
      organization: 'Amazon Web Services',
      issueDate: new Date('2024-03-01'),
      credentialId: 'AWS-ACAD-CF9',
      category: 'Cloud Infrastructure',
      localImage: '/portfolio/achievements/techno-spirit/3.jpg',
    },
  ];

  for (const cert of certsData) {
    const { localImage, ...rest } = cert;
    console.log(`  Uploading image for certificate: ${rest.title}`);
    const imageUrl = await uploadToCloudinary(localImage, 'certificates');
    await Certificate.create({ ...rest, image: imageUrl || '', status: 'published' });
    console.log(`  ✅ Created certificate: ${rest.title}\n`);
  }

  console.log(`🏅 Certificates seeded: ${certsData.length} records\n`);
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🌱 Portfolio Data Seeder');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    await connect();
    await seedAchievements();
    await seedProjects();
    await seedSkills();
    await seedExperience();
    await seedEducation();
    await seedCertificates();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅ All seed data inserted successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB disconnected.');
    process.exit(0);
  }
}

main();
