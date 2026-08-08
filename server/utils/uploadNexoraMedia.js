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

const uploadNexoraMedia = async () => {
  try {
    await connectDB();

    const photoPaths = [
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784136205309.png', // Group on stage
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784136211420.png', // Certificate
    ];

    const uploadedUrls = [];

    console.log('Uploading 2 NEXORA event photos to Cloudinary...');
    for (let i = 0; i < photoPaths.length; i++) {
      console.log(`Uploading image ${i + 1}/${photoPaths.length}...`);
      const res = await cloudinary.uploader.upload(photoPaths[i], {
        folder: 'madanraj_portfolio/nexora',
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
    }
    console.log('Images uploaded successfully:', uploadedUrls);

    // Create Achievement
    console.log('Creating Achievement record in MongoDB...');
    const titleText = '1st Place - Mini Web Development Hackathon "Reimagine" at NEXORA 2K26';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Secured 1st place in the Mini Web Development Hackathon 'Reimagine' at NEXORA 2K26, organized by Government College of Engineering, Kolhapur. Developed a custom web platform solution within a strict 6-hour development timeframe.",
        eventDetails: 'Hosted by Government College of Engineering, Kolhapur. Collaborated with Shambhu Gaikwad and Amey Mohite.',
        date: new Date('2026-04-17'),
        category: 'Hackathons',
        photos: uploadedUrls,
        certificateUrl: uploadedUrls[1], // Certificate image
        status: 'published',
        order: 2
      });
      console.log('Achievement successfully registered in MongoDB!');
    } else {
      console.log('Achievement already exists in MongoDB, skipping.');
    }

    // Seed visual Gallery items
    console.log('Seeding visual Gallery items...');
    const galleryItems = [
      { title: 'NEXORA 2K26 Reimagine Hackathon Winner Presentation', mediaUrl: uploadedUrls[0] },
      { title: 'NEXORA 2K26 Reimagine 1st Place Certificate of Achievement', mediaUrl: uploadedUrls[1] }
    ];

    for (const item of galleryItems) {
      const exists = await GalleryItem.findOne({ mediaUrl: item.mediaUrl });
      if (!exists) {
        await GalleryItem.create({
          title: item.title,
          category: 'hackathons',
          mediaUrl: item.mediaUrl,
          status: 'published'
        });
      }
    }
    console.log('Gallery records seeded!');

    console.log('NEXORA data seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed NEXORA data:', err.message);
    process.exit(1);
  }
};

uploadNexoraMedia();
