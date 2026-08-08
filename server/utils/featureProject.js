import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';

// Setup DNS overrides for MongoDB
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const feature = async () => {
  try {
    await connectDB();
    console.log('Marking Abhaya project as featured...');
    const result = await Project.updateMany(
      { title: 'Abhaya - Proactive Women Safety App' },
      { featured: true }
    );
    console.log(`Successfully featured ${result.modifiedCount} project(s)!`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to update project status:', err.message);
  }
};

feature();
