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

const seedGondiaMedia = async () => {
  try {
    await connectDB();

    const photoPath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784140042336.png';

    console.log('Uploading GP Gondia award photo to Cloudinary...');
    const res = await cloudinary.uploader.upload(photoPath, {
      folder: 'madanraj_portfolio/gondia',
      resource_type: 'image'
    });
    
    console.log('Image uploaded successfully:', res.secure_url);

    // Create Achievement
    console.log('Registering GP Gondia Paper Presentation Achievement in MongoDB...');
    const titleText = '1st Runner-Up — National-Level Paper Presentation at GP Gondia';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Secured the 1st Runner-Up position in the National-Level Technical Paper Presentation Competition held at Government Polytechnic, Gondia. Presented a research paper on 'Artificial Intelligence and Virtual Reality in Anxiety Mitigation,' exploring new techniques in mental health engineering.",
        eventDetails: 'Hosted by the Computer Engineering & Information Technology Department, Government Polytechnic, Gondia.',
        date: new Date('2026-03-12'),
        category: 'Paper Presentations',
        photos: [res.secure_url],
        certificateUrl: res.secure_url,
        status: 'published',
        order: 7
      });
      console.log('Paper Presentation achievement registered successfully!');
    } else {
      console.log('Paper Presentation achievement already exists, skipping.');
    }

    // Seed Gallery
    console.log('Seeding visual gallery...');
    const exists = await GalleryItem.findOne({ mediaUrl: res.secure_url });
    if (!exists) {
      await GalleryItem.create({
        title: 'GP Gondia National Paper Presentation Award Ceremony',
        category: 'competitions',
        mediaUrl: res.secure_url,
        status: 'published'
      });
      console.log('Gallery record seeded!');
    }

    console.log('Gondia data seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed Gondia data:', err.message);
    process.exit(1);
  }
};

seedGondiaMedia();
