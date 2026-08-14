import mongoose from 'mongoose';
import 'dotenv/config';
import Project from './models/Project.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const inspect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');
    const projects = await Project.find({}).select('title image heroImage gallery');
    console.log('Projects details:');
    console.log(JSON.stringify(projects, null, 2));
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

inspect();
