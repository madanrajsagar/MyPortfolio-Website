import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Setting from '../models/Setting.js';
import Project from '../models/Project.js';

// Setup custom DNS resolution (Google/Cloudflare fallback) to bypass ECONNREFUSED issues on local machines
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const newProjects = [
  {
    title: 'Abhaya',
    description: 'A security and women\'s safety platform designed to provide quick distress assistance and emergency alerts.',
    longDescription: 'Abhaya is a community and individual safety platform that allows real-time location sharing, SOS alerts to emergency contacts, and active tracking with instant alert routing.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Geocoding Maps API'],
    githubLink: 'https://github.com/madanrajsagar/Abhaya',
    liveDemo: '',
    heroImage: 'https://images.unsplash.com/photo-1508847154043-be12a62861c1?w=800',
    featured: true,
    status: 'published',
    order: 1
  },
  {
    title: 'TravelNest',
    description: 'A premium accommodation booking and listing platform featuring high-fidelity glassmorphism designs.',
    longDescription: 'TravelNest is a fully functional web platform offering property exploration, bookings management, secure checkout integration, and direct owner message hubs.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Mongoose ORM'],
    githubLink: 'https://github.com/madanrajsagar/TravelNest',
    liveDemo: 'https://travel-nest-delta-indol.vercel.app/listings',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    featured: true,
    status: 'published',
    order: 2
  },
  {
    title: 'Government OBC VJNT Hostel Management',
    description: 'A comprehensive management platform for Government OBC/VJNT hostels to track student records, amenities, and admissions.',
    longDescription: 'A robust administrative tool designed to digitize hostel operations, room allocations, student attendance registers, and mess fee collection databases.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose ORM', 'JWT Authentication'],
    githubLink: 'https://github.com/harshadbk/Government_OBC_VJNT_Hostel_Prod.git',
    liveDemo: 'https://www.hostelmanagement.online/',
    heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    featured: true,
    status: 'published',
    order: 3
  },
  {
    title: 'MSBTE Navigator',
    description: 'Study and reference platform for MSBTE diploma engineering students, offering resource downloads.',
    longDescription: 'MSBTE Navigator is a community-driven database catalog serving study notes, past papers, syllabus charts, and exam schedules directly in the browser.',
    techStack: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
    githubLink: 'https://github.com/madanrajsagar/MsbteNavigator',
    liveDemo: '',
    heroImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    featured: true,
    status: 'published',
    order: 4
  }
];

const updateData = async () => {
  try {
    await connectDB();

    // 1. Update Portfolio Settings Document
    console.log('Locating setting document...');
    let setting = await Setting.findOne();
    if (!setting) {
      console.log('No setting found, creating new one...');
      setting = new Setting();
    }

    setting.socialLinks = {
      github: 'https://github.com/madanrajsagar',
      linkedin: 'https://www.linkedin.com/in/madanraj-sagar-0a700a308/',
      leetcode: 'https://leetcode.com/u/madanrajsagar/',
      codechef: 'https://www.codechef.com/users/madanrajsagar',
      gfg: 'https://geeksforgeeks.org', // standard fallback
      email: 'madanrajsagar83@gmail.com'
    };

    setting.contactDetails = {
      email: 'madanrajsagar83@gmail.com',
      phone: '+91-8999715539',
      address: 'Walchand College of Engineering, Sangli, Maharashtra, India',
      googleMapIframe: ''
    };

    await setting.save();
    console.log('Successfully updated settings with new contact and social links!');

    // 2. Update Projects List
    console.log('Clearing existing projects...');
    const deleteProj = await Project.deleteMany({});
    console.log(`Deleted ${deleteProj.deletedCount} projects.`);

    console.log('Inserting new projects...');
    const inserted = await Project.insertMany(newProjects);
    console.log(`Successfully seeded ${inserted.length} new projects!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update settings and projects in database:', error);
    process.exit(1);
  }
};

updateData();
