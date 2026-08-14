import mongoose from 'mongoose';
import 'dotenv/config';
import Education from './models/Education.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const inspect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');
    const edu = await Education.find({});
    console.log('Education docs:', JSON.stringify(edu, null, 2));
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

inspect();
