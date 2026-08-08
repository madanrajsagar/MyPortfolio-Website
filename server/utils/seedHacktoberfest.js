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

const seedHacktoberfest = async () => {
  try {
    await connectDB();

    const photoPaths = [
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784139598276.png', // Supercontributor badge
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784139605325.png', // Badges grid board
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784139617513.png', // Tree nation cert
    ];

    const uploadedUrls = [];

    console.log('Uploading Hacktoberfest media to Cloudinary...');
    for (let i = 0; i < photoPaths.length; i++) {
      console.log(`Uploading image ${i + 1}/${photoPaths.length}...`);
      const res = await cloudinary.uploader.upload(photoPaths[i], {
        folder: 'madanraj_portfolio/hacktoberfest',
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
    }
    console.log('Images uploaded successfully:', uploadedUrls);

    // Create Achievement
    console.log('Registering Hacktoberfest Achievement in MongoDB...');
    const titleText = 'Super Contributor — Hacktoberfest 2025';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Successfully completed Hacktoberfest 2025. Contributed to multiple open-source repositories on GitHub with 6 accepted pull requests, earning the Super Contributor golden badge on Holopin. Included in the first 10,000 global contributors to earn the official T-shirt. Also, a tree was planted in my name through Tree-Nation's sustainability initiative in Lost Forests, California.\n\n🌱 Tree Certificate: https://lnkd.in/du43rmpH\n🏅 Holopin Badges: https://lnkd.in/dPmtWGeF",
        eventDetails: 'Global Open Source Event. Holopin board profile: https://holopin.io/@madanrajsagar.',
        date: new Date('2025-10-31'),
        category: 'Open Source Contributions',
        photos: uploadedUrls,
        certificateUrl: 'https://lnkd.in/du43rmpH', // Tree-nation cert link
        status: 'published',
        order: 6
      });
      console.log('Hacktoberfest achievement successfully registered!');
    } else {
      console.log('Hacktoberfest achievement already exists, skipping.');
    }

    // Seed Gallery
    console.log('Seeding visual gallery...');
    const galleryItems = [
      { title: 'Hacktoberfest 2025 Holopin Supercontributor Badge', mediaUrl: uploadedUrls[0] },
      { title: 'Hacktoberfest 2025 Holopin Badges Collection', mediaUrl: uploadedUrls[1] },
      { title: 'Hacktoberfest 2025 Tree-Nation Certificate of Planting', mediaUrl: uploadedUrls[2] }
    ];

    for (const item of galleryItems) {
      const exists = await GalleryItem.findOne({ mediaUrl: item.mediaUrl });
      if (!exists) {
        await GalleryItem.create({
          title: item.title,
          category: 'events',
          mediaUrl: item.mediaUrl,
          status: 'published'
        });
      }
    }
    console.log('Gallery records seeded!');

    console.log('Hacktoberfest seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed Hacktoberfest data:', err.message);
    process.exit(1);
  }
};

seedHacktoberfest();
