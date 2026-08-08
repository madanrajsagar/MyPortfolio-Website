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

const uploadPromptBattleMedia = async () => {
  try {
    await connectDB();

    const photoPath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784136843732.png';

    console.log('Uploading AI Prompt Battle photo to Cloudinary...');
    const res = await cloudinary.uploader.upload(photoPath, {
      folder: 'madanraj_portfolio/prompt_battle',
      resource_type: 'image'
    });
    
    console.log('Image uploaded successfully:', res.secure_url);

    // Create Achievement
    console.log('Creating Achievement record in MongoDB...');
    const titleText = '1st Place - State Level AI Prompt Battle at CreoWorld 2K26';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Secured 1st place in the State Level AI Prompt Battle competition at Adarsh Institute of Technology and Research Center, Vita. Conducted as part of CreoWorld 2K26 with over 105+ students participating. The event evaluated prompt engineering logic, quiz fundamentals, image generation parameters, and dynamic user presentations.",
        eventDetails: 'Conducted at Adarsh Institute of Technology and Research Center, Vita as part of CreoWorld 2K26. Beat 105+ participants.',
        date: new Date('2026-03-25'), // Spring 2026 event
        category: 'State Level Tech Events',
        photos: [res.secure_url],
        certificateUrl: res.secure_url, // Use photo as certificate/proof
        status: 'published',
        order: 4
      });
      console.log('Achievement successfully registered in MongoDB!');
    } else {
      console.log('Achievement already exists in MongoDB, skipping.');
    }

    // Seed visual Gallery item
    console.log('Seeding visual Gallery item...');
    const exists = await GalleryItem.findOne({ mediaUrl: res.secure_url });
    if (!exists) {
      await GalleryItem.create({
        title: 'CreoWorld 2K26 AI Prompt Battle Winner',
        category: 'competitions',
        mediaUrl: res.secure_url,
        status: 'published'
      });
      console.log('Gallery record seeded!');
    }

    console.log('AI Prompt Battle data seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed Prompt Battle data:', err.message);
    process.exit(1);
  }
};

uploadPromptBattleMedia();
