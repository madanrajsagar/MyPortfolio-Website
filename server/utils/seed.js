import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import Navigation from '../models/Navigation.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import Certificate from '../models/Certificate.js';
import GalleryItem from '../models/GalleryItem.js';
import Blog from '../models/Blog.js';

// Setup custom DNS resolution (Google/Cloudflare fallback) to bypass ECONNREFUSED issues on local machines
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Setting.deleteMany({}),
      Navigation.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Achievement.deleteMany({}),
      Certificate.deleteMany({}),
      GalleryItem.deleteMany({}),
      Blog.deleteMany({}),
    ]);

    console.log('Seeding admin credentials...');
    const adminUser = await User.create({
      username: 'madanraj',
      email: 'madanrajsagar83@gmail.com',
      password: 'adminpassword123', // Automatically hashed by the pre-save schema hook
    });

    console.log('Seeding portfolio configuration settings...');
    const settings = await Setting.create({
      theme: 'dark',
      websiteTitle: 'Madanraj | AI & ML Engineer & MERN Developer',
      websiteDescription: 'Personal Brand and Portfolio Platform of Madanraj, showcasing CSE expertise, AI/ML engineering, and MERN stack applications.',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        leetcode: 'https://leetcode.com',
        codechef: 'https://codechef.com',
        gfg: 'https://geeksforgeeks.org',
        email: 'madanrajsagar83@gmail.com',
      },
    });

    console.log('Seeding dynamic navigation menu items...');
    const menuLinks = [
      { label: 'Home', path: '/', order: 1 },
      { label: 'About', path: '/#about', order: 2 },
      { label: 'Achievements', path: '/#achievements', order: 3 },
      { label: 'Projects', path: '/#projects', order: 4 },
      { label: 'Skills', path: '/#skills', order: 5 },
      { label: 'Experience', path: '/#experience', order: 6 },
      { label: 'Certificates', path: '/certificates', order: 7 },
      { label: 'Gallery', path: '/gallery', order: 8 },
      { label: 'Resume', path: '/resume', order: 9 },
      { label: 'Blogs', path: '/blogs', order: 10 },
      { label: 'Contact', path: '/#contact', order: 11 },
    ];
    await Navigation.insertMany(menuLinks);

    console.log('Seeding skills...');
    const skills = [
      { name: 'React.js', category: 'Frontend', icon: 'Atom', proficiency: 92, experienceYears: 3, order: 1 },
      { name: 'Tailwind CSS', category: 'Frontend', icon: 'Wind', proficiency: 95, experienceYears: 3, order: 2 },
      { name: 'Node.js', category: 'Backend', icon: 'Cpu', proficiency: 88, experienceYears: 2, order: 3 },
      { name: 'Express.js', category: 'Backend', icon: 'Server', proficiency: 90, experienceYears: 2, order: 4 },
      { name: 'MongoDB', category: 'Database', icon: 'Database', proficiency: 85, experienceYears: 2, order: 5 },
      { name: 'Python', category: 'Programming', icon: 'Code2', proficiency: 80, experienceYears: 3, order: 6 },
      { name: 'Java', category: 'Programming', icon: 'FileCode2', proficiency: 82, experienceYears: 4, order: 7 },
      { name: 'TensorFlow', category: 'AI', icon: 'Workflow', proficiency: 75, experienceYears: 2, order: 8 },
      { name: 'Docker', category: 'Tools', icon: 'Layers', proficiency: 78, experienceYears: 1, order: 9 },
    ];
    await Skill.insertMany(skills);

    console.log('Seeding projects...');
    const mockProjects = [
      {
        title: 'TravelNest',
        description: 'A premium travel booking and accommodation MERN stack platform featuring high-fidelity glassmorphism views.',
        longDescription: 'TravelNest is a fully functional web platform offering property exploration, bookings management, secure checkout integration, and direct owner message hubs.',
        heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        features: ['Real-time searches', 'Geocoding Maps API', 'Secure Checkout payments', 'Interactive reviews'],
        challenges: 'Managing token refreshes during payment handshakes.',
        learnings: 'Implemented clean HTTP-only Axios interceptors.',
        githubLink: 'https://github.com',
        liveDemo: 'https://example.com',
        timeline: '3 months',
        featured: true,
        status: 'published',
      },
      {
        title: 'MSBTE Navigator',
        description: 'Study and reference platform for MSBTE diploma engineering students, offering resource downloads.',
        longDescription: 'MSBTE Navigator is a community-driven database catalog serving study notes, past papers, syllabus charts, and exam schedules directly in the browser.',
        heroImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        techStack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
        features: ['Fast search filtering', 'PDF viewer panel', 'Admin dashboard uploads'],
        challenges: 'Uploading large files reliably without timeout errors.',
        learnings: 'Used chunked CDN buffer streams.',
        githubLink: 'https://github.com',
        liveDemo: 'https://example.com',
        timeline: '2 months',
        featured: true,
        status: 'published',
      },
    ];
    await Project.insertMany(mockProjects);

    console.log('Seeding experiences...');
    const experiences = [
      {
        company: 'Google Developer Groups (GDG) WCE',
        role: 'Assistant Secretary & Web Lead',
        description: ['Coordinating campus workshops', 'Leading frontend engineering of chapter websites', 'Public speaking and technical anchoring'],
        techStack: ['HTML', 'CSS', 'JavaScript', 'React'],
        type: 'leadership',
        startDate: new Date('2025-06-01'),
        isCurrent: true,
        location: 'Sangli, India',
        status: 'published',
      },
    ];
    await Experience.insertMany(experiences);

    console.log('Seeding education...');
    const educations = [
      {
        institution: 'Walchand College of Engineering, Sangli',
        degree: 'B.Tech',
        fieldOfStudy: 'Artificial Intelligence & Machine Learning',
        cgpa: 9.29,
        startDate: new Date('2023-08-01'),
        certificates: [],
        achievements: ['Ranked 1st in Semesters', 'Active lead in GDG'],
        status: 'published',
      },
      {
        institution: 'Walchand College of Engineering, Sangli',
        degree: 'Diploma',
        fieldOfStudy: 'Computer Technology',
        marks: 95.09,
        startDate: new Date('2020-08-01'),
        endDate: new Date('2023-06-30'),
        certificates: [],
        achievements: ['College Topper', 'Rank 1 for four consecutive semesters', 'Maharashtra State Rank: 330'],
        status: 'published',
      },
    ];
    await Education.insertMany(educations);

    console.log('Database successfully seeded with default portfolio values!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding database failed:', error.message);
    process.exit(1);
  }
};

seedData();
