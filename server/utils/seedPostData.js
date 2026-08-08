import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';

// Setup DNS overrides
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const seedPostData = async () => {
  try {
    await connectDB();

    console.log('Inserting Hackathon project: Abhaya...');
    
    // Check if project exists to avoid duplicate seeding
    const projectExists = await Project.findOne({ title: 'Abhaya - Proactive Women Safety App' });
    if (!projectExists) {
      await Project.create({
        title: 'Abhaya - Proactive Women Safety App',
        description: 'A proactive safety and travel companion app designed to identify route deviations, suspected stops, and map sensitive zones using real-world datasets.',
        longDescription: 'Developed during a national-level hackathon, Abhaya is a women safety application focused on proactive protection, real-time risk detection, and practical emergency response. The app tracks route deviations, suspects extended travel stops, and alerts emergency contacts with a secure evidence and reporting pipeline.',
        heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600', // Premium cybersecurity/safety tech image placeholder
        techStack: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Google Maps API'],
        features: [
          'Route deviation monitoring',
          'SUSPECT travel stop warnings',
          'High-risk location zones alert',
          'Timely emergency notifications',
          'Timelined evidence logs',
          'Dynamic risk level scoring'
        ],
        architecture: [
          'Mobile Client app (React Native)',
          'Backend Server core (Node.js & Express)',
          'Database layer (MongoDB)',
          'Geolocation Mapping service (Google Maps API)'
        ],
        timeline: 'Hackathon Project',
        status: 'published',
        order: 1
      });
      console.log('Project "Abhaya" seeded successfully!');
    } else {
      console.log('Project "Abhaya" already exists, skipping.');
    }

    console.log('Inserting Hackathon Achievement...');
    const achievementExists = await Achievement.findOne({ title: '1st Runner-Up at D Y Patil National Hackathon' });
    if (!achievementExists) {
      await Achievement.create({
        title: '1st Runner-Up at D Y Patil National Hackathon',
        description: "Secured 1st Runner-Up at a national-level hackathon hosted by D Y Patil Education Society (Deemed to be University), Kolhapur with our project 'Abhaya'—a proactive women's safety travel companion.",
        eventDetails: 'Hosted by D Y Patil Education Society, Kolhapur. Developed by team "Bit Manipulators" consisting of Shambhu Gaikwad, Harshad Khatale, Amey Mohite, and Madanraj Sagar.',
        date: new Date('2026-07-01'), // Approximate date based on current schedule
        category: 'Hackathons',
        status: 'published',
        order: 1
      });
      console.log('Achievement seeded successfully!');
    } else {
      console.log('Achievement already exists, skipping.');
    }

    console.log('Seeding process complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding post failed:', err.message);
    process.exit(1);
  }
};

seedPostData();
