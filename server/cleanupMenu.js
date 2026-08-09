import mongoose from 'mongoose';
import 'dotenv/config';
import Navigation from './models/Navigation.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing navigation items
    await Navigation.deleteMany({});
    console.log('Cleared existing navigation links.');

    const activeLinks = [
      { label: 'About', path: '/#about', order: 0 },
      { label: 'Achievements', path: '/#achievements', order: 1 },
      { label: 'Projects', path: '/#projects', order: 2 },
      { label: 'Skills', path: '/#skills', order: 3 },
      { label: 'Experience', path: '/#experience', order: 4 },
      { label: 'Contact', path: '/#contact', order: 5 },
    ];

    await Navigation.insertMany(activeLinks);
    console.log('Successfully seeded clean active navigation links!');

    mongoose.disconnect();
  } catch (err) {
    console.error('Error cleaning up menu:', err);
  }
};

cleanup();
