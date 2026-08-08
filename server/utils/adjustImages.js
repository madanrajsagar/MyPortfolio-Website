import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';

// Setup DNS overrides for MongoDB
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const adjust = async () => {
  try {
    await connectDB();

    console.log('Updating Abhaya project cover image to a professional tech mockup...');
    // Replace giant cheque photo with a premium tech/security concept image on the project card
    const project = await Project.findOne({ title: 'Abhaya - Proactive Women Safety App' });
    if (project) {
      project.heroImage = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600'; // Clean security/dashboard illustration
      project.gallery = []; // Remove event photos from project gallery
      await project.save();
      console.log('Project updated successfully.');
    }

    console.log('Verifying Hackathon Achievement photo bindings...');
    const achievement = await Achievement.findOne({ title: '1st Runner-Up at D Y Patil National Hackathon' });
    if (achievement) {
      // Ensure the three Cloudinary photo URLs are linked here
      achievement.photos = [
        'https://res.cloudinary.com/djhoiggsv/image/upload/v1784133928/madanraj_portfolio/hackathon/chgxnejs3yupmvbtk6xx.jpg',
        'https://res.cloudinary.com/djhoiggsv/image/upload/v1784133931/madanraj_portfolio/hackathon/bp9dv1uomr4hc9swycuu.jpg',
        'https://res.cloudinary.com/djhoiggsv/image/upload/v1784133936/madanraj_portfolio/hackathon/e0zipgkxalgrophchrto.jpg'
      ];
      await achievement.save();
      console.log('Achievement photos updated successfully.');
    }

    console.log('Data adjustments complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Adjustment failed:', err.message);
  }
};

adjust();
