import mongoose from 'mongoose';
import 'dotenv/config';
import Education from './models/Education.js';
import Highlight from './models/Highlight.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    // 1. Update B.Tech Education document achievements
    const btechEdu = await Education.findOne({ degree: /B\.Tech/i });
    if (btechEdu) {
      // Clean up achievements and add Rank 2
      btechEdu.achievements = [
        "CGPA: 9.36",
        "Class Rank: 2 (Second Topper)",
        "Consistently strong academic performance",
        "Active involvement in GDG WCE and technical activities",
        "Building expertise in AI/ML, software development, and problem solving"
      ];
      await btechEdu.save();
      console.log('Updated B.Tech Education achievements successfully!');
    }

    // 2. Update Highlight collection for CGPA
    const cgpaHighlight = await Highlight.findOne({ title: /CGPA/i });
    if (cgpaHighlight) {
      cgpaHighlight.subtitle = 'B.Tech AI & ML (Class Rank 2)';
      cgpaHighlight.badge = '9.36 CGPA (Rank 2)';
      await cgpaHighlight.save();
      console.log('Updated CGPA Highlight successfully!');
    }

    mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error(err);
  }
};

update();
