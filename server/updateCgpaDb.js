import mongoose from 'mongoose';
import 'dotenv/config';
import Highlight from './models/Highlight.js';
import Education from './models/Education.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const updateDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Update Highlight collection
    const highlightsUpdated = await Highlight.updateMany(
      { title: /9\.29/ },
      { $set: { title: 'Current CGPA – 9.36', badge: '9.36 CGPA' } }
    );
    console.log('Updated highlights:', highlightsUpdated.modifiedCount);

    // Also check for badge match if title didn't match
    const highlightsBadgeUpdated = await Highlight.updateMany(
      { badge: /9\.29/ },
      { $set: { badge: '9.36 CGPA' } }
    );
    console.log('Updated highlights by badge:', highlightsBadgeUpdated.modifiedCount);

    // 2. Update Education collection
    const educationDocs = await Education.find({});
    let eduUpdatedCount = 0;
    for (let edu of educationDocs) {
      if (edu.cgpa === 9.29 || edu.cgpa === '9.29') {
        edu.cgpa = 9.36;
        if (Array.isArray(edu.description)) {
          edu.description = edu.description.map(desc => 
            desc.replace('9.29', '9.36')
          );
        }
        await edu.save();
        eduUpdatedCount++;
      }
    }
    console.log('Updated education documents:', eduUpdatedCount);

    mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Error updating database:', err);
  }
};

updateDb();
