import mongoose from 'mongoose';
import 'dotenv/config';
import Highlight from './models/Highlight.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Highlight.countDocuments({});
    console.log('Total documents in Highlight collection:', count);
    
    const docs = await Highlight.find({});
    console.log('Documents:', JSON.stringify(docs, null, 2));
    
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkDb();
