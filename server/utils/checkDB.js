import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Achievement from '../models/Achievement.js';

// Setup custom DNS resolution
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const check = async () => {
  try {
    await connectDB();
    const achievements = await Achievement.find();
    console.log('Achievements in DB:', JSON.stringify(achievements, null, 2));
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

check();
