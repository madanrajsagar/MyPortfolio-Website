import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Achievement from '../models/Achievement.js';
import GalleryItem from '../models/GalleryItem.js';

// Setup DNS overrides for MongoDB
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'djhoiggsv',
  api_key: process.env.CLOUDINARY_API_KEY || '255314377583214',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'TBntNFuNicu7JwNznuJ7SXA08rI',
});

const seedYavatmalMedia = async () => {
  try {
    await connectDB();

    const photoPath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784140246550.png';

    console.log('Uploading Yavatmal presentation photo to Cloudinary...');
    const res = await cloudinary.uploader.upload(photoPath, {
      folder: 'madanraj_portfolio/yavatmal',
      resource_type: 'image'
    });
    
    console.log('Image uploaded successfully:', res.secure_url);

    // Create Achievement
    console.log('Registering MSBTE Paper Presentation Achievement in MongoDB...');
    const titleText = '3rd Place — MSBTE State Level Paper Presentation';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Represented our college at the State-Level Technical Paper Presentation Competition sponsored by MSBTE at Government Polytechnic, Yavatmal, and brought home a 3rd place win. Collaborated with Abhishek Awale to present our research topic 'Leveraging AI and ML in Modern Agriculture.'",
        eventDetails: 'Conducted by Government Polytechnic, Yavatmal. Sponsored by MSBTE.',
        date: new Date('2025-02-18'),
        category: 'Paper Presentations',
        photos: [res.secure_url],
        certificateUrl: res.secure_url,
        status: 'published',
        order: 8
      });
      console.log('MSBTE Paper Presentation achievement registered successfully!');
    } else {
      console.log('MSBTE Paper Presentation achievement already exists, skipping.');
    }

    // Seed Gallery
    console.log('Seeding visual gallery...');
    const exists = await GalleryItem.findOne({ mediaUrl: res.secure_url });
    if (!exists) {
      await GalleryItem.create({
        title: 'MSBTE State Level Technical Paper Presentation Yavatmal',
        category: 'competitions',
        mediaUrl: res.secure_url,
        status: 'published'
      });
      console.log('Gallery record seeded!');
    }

    console.log('Yavatmal data seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed Yavatmal data:', err.message);
    process.exit(1);
  }
};

seedYavatmalMedia();
