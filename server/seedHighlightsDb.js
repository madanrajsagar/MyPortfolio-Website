import mongoose from 'mongoose';
import 'dotenv/config';
import dns from 'dns';
import Highlight from './models/Highlight.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI;

const seedHighlights = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing highlights
    await Highlight.deleteMany({});
    console.log('Cleared existing highlights.');

    const initialHighlights = [
      {
        title: 'Govt. Hostel Management Website',
        subtitle: 'Officially Approved Admin Portal',
        description: 'Officially approved by Samaj Kalyan hostel authorities. Fully hosted on AWS & Netlify with Hostinger domain. Serving 100+ active live users.',
        icon: 'Globe',
        badge: '100+ Live Users',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        glow: 'shadow-indigo-500/10',
        featured: true,
        order: -1,
      },
      {
        title: 'Winner – AI Prompt Battle',
        subtitle: 'Prompt Engineering Championship',
        description: 'Won 1st place in the real-time AI prompt battle by crafting highly optimized prompts and few-shot logic for LLMs under constraints.',
        icon: 'Award',
        badge: 'Winner',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        glow: 'shadow-amber-500/10',
        featured: true,
        order: 0,
      },
      {
        title: '1st Runner-Up – HackoutSav',
        subtitle: 'National Hackathon',
        description: 'Secured 2nd place out of 100+ teams across Maharashtra, winning a cash prize of ₹15,000 for building a functional MERN prototype.',
        icon: 'Trophy',
        badge: '₹15,000 Prize',
        color: 'text-gray-300',
        bg: 'bg-white/5',
        border: 'border-white/10',
        glow: 'shadow-white/5',
        featured: true,
        order: 1,
      },
      {
        title: 'Winner – Reimagine',
        subtitle: 'Innovation Challenge',
        description: 'Secured 1st place by architecting and presenting a modern digital replacement for institutional administrative workflows.',
        icon: 'Sparkles',
        badge: 'Winner',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        glow: 'shadow-amber-500/10',
        featured: true,
        order: 2,
      },
      {
        title: 'College Topper (Diploma)',
        subtitle: 'Computer Technology',
        description: 'Graduated at Rank 1 overall with 95.09% aggregate, remaining topper for four consecutive semesters.',
        icon: 'GraduationCap',
        badge: '95.09% Marks',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        glow: 'shadow-violet-500/10',
        featured: true,
        order: 3,
      },
      {
        title: 'Maharashtra State Rank 330',
        subtitle: 'MSBTE Board merit list',
        description: 'Placed in the top percentile among thousands of computer diploma students across the entire state of Maharashtra.',
        icon: 'MapPin',
        badge: 'State Merit',
        color: 'text-rose-400',
        bg: 'bg-rose-500/5',
        border: 'border-rose-500/15',
        glow: 'shadow-rose-500/5',
        featured: true,
        order: 4,
      },
      {
        title: 'Current CGPA – 9.29',
        subtitle: 'B.Tech AI & ML at Walchand',
        description: 'Consistently high academic standing in Artificial Intelligence & Machine Learning specialization subjects.',
        icon: 'Star',
        badge: '9.29 CGPA',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        glow: 'shadow-emerald-500/10',
        featured: true,
        order: 5,
      },
      {
        title: 'Built Multiple Full Stack & AI Projects',
        subtitle: 'MERN + Local LLMs',
        description: 'From AI safety portals (Abhaya) to resource catalogs (MSBTE Navigator) and travel platforms (TravelNest).',
        icon: 'Code2',
        badge: '4+ Projects',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        glow: 'shadow-indigo-500/10',
        featured: true,
        order: 6,
      },
    ];

    await Highlight.insertMany(initialHighlights);
    console.log('Seeded highlights successfully!');

    // Let's also insert the Govt Hostel Management Website into Projects collection if it doesn't exist
    const Project = mongoose.model('Project');
    const existingProject = await Project.findOne({ title: 'Govt. Hostel Management Website' });
    if (!existingProject) {
      await Project.create({
        title: 'Govt. Hostel Management Website',
        tagline: 'Officially Approved Admin Portal',
        description: 'Officially approved by Samaj Kalyan hostel authorities. Fully hosted on AWS & Netlify with Hostinger domain. Serving 100+ active live users.',
        category: 'Full Stack',
        projectStatus: 'Live',
        featured: true,
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Netlify'],
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Netlify'],
        longDescription: 'A custom-built enterprise resource portal for institutional administrative workflows, officially approved by Samaj Kalyan hostel authorities. Runs fully on AWS & Netlify under custom domain, supporting student room allocations, dining logs, grievances, and notice management with 100+ live users.',
        problem: 'Samaj Kalyan hostel lacked a digital grievance, room allocation, and dining tracking system, leading to paper records and communication lag.',
        solution: 'Built a robust MERN stack administrative panel with distinct roles for warden, staff, and students, with real-time updates and AWS file hosting.',
        features: ['Automated room allotment', 'Real-time notice board', 'Mess expense calculator', 'Official Samaj Kalyan admin module'],
        githubLink: 'https://github.com/madanrajsagar',
        liveDemo: 'https://samajkalyanhostel.in', // Custom Hostinger domain placeholder
      });
      console.log('Created project entry for Govt. Hostel Management Website!');
    } else {
      existingProject.featured = true;
      await existingProject.save();
      console.log('Updated existing project featured status.');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding highlights:', error);
  }
};

seedHighlights();
