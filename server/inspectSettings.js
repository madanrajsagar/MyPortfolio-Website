import mongoose from 'mongoose';
import 'dotenv/config';
import Setting from './models/Setting.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const inspect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');
    const setting = await Setting.findOne({});
    console.log('Setting:', JSON.stringify(setting, null, 2));
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

inspect();
