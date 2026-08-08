import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Setting from '../models/Setting.js';

// Setup DNS overrides
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const check = async () => {
  try {
    await connectDB();
    const list = await Setting.find({});
    console.log(`Found ${list.length} settings documents:`);
    list.forEach((doc, i) => {
      console.log(`\nDocument #${i + 1}:`);
      console.log(`ID: ${doc._id}`);
      console.log(`Created At: ${doc.createdAt}`);
      console.log(`homeHero profileImage:`, doc.homeHero?.profileImage);
      console.log(`homeHero title/name:`, doc.homeHero?.name);
    });
    mongoose.connection.close();
  } catch (err) {
    console.error('Check failed:', err.message);
  }
};

check();
