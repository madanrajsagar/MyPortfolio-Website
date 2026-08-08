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

const uploadNirmitiMedia = async () => {
  try {
    await connectDB();

    const photoPaths = [
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784136622300.png', // Stage award
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784136628721.jpg', // Madanraj holding trophy/cert
    ];

    const uploadedUrls = [];

    console.log('Uploading 2 NIRMITI event photos to Cloudinary...');
    for (let i = 0; i < photoPaths.length; i++) {
      console.log(`Uploading image ${i + 1}/${photoPaths.length}...`);
      const res = await cloudinary.uploader.upload(photoPaths[i], {
        folder: 'madanraj_portfolio/nirmiti',
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
    }
    console.log('Images uploaded successfully:', uploadedUrls);

    // Create Achievement
    console.log('Creating Achievement record in MongoDB...');
    const titleText = '1st Place - TECHNO-SPIRIT (State-Level Event) at NIRMITI 2026';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Secured 1st place in the prestigious state-level technical event 'TECHNO-SPIRIT' during NIRMITI 2026, hosted at PVPIT, Budhgaon. The competition challenged participants through multiple rounds involving technical QA, logical problem-solving, and team collaboration.",
        eventDetails: 'Hosted at PVPIT, Budhgaon. Conducted as a State-Level event on 2nd April 2026.',
        date: new Date('2026-04-02'),
        category: 'State Level Tech Events',
        photos: uploadedUrls,
        certificateUrl: uploadedUrls[1], // Personal photo with certificate
        status: 'published',
        order: 3
      });
      console.log('Achievement successfully registered in MongoDB!');
    } else {
      console.log('Achievement already exists in MongoDB, skipping.');
    }

    // Seed visual Gallery items
    console.log('Seeding visual Gallery items...');
    const galleryItems = [
      { title: 'NIRMITI 2026 Techno-Spirit 1st Place Presentation', mediaUrl: uploadedUrls[0] },
      { title: 'NIRMITI 2026 Techno-Spirit 1st Place Trophy & Certificate', mediaUrl: uploadedUrls[1] }
    ];

    for (const item of galleryItems) {
      const exists = await GalleryItem.findOne({ mediaUrl: item.mediaUrl });
      if (!exists) {
        await GalleryItem.create({
          title: item.title,
          category: 'competitions',
          mediaUrl: item.mediaUrl,
          status: 'published'
        });
      }
    }
    console.log('Gallery records seeded!');

    console.log('NIRMITI data seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed NIRMITI data:', err.message);
    process.exit(1);
  }
};

uploadNirmitiMedia();
