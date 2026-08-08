import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Achievement from '../models/Achievement.js';
import Setting from '../models/Setting.js';
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

const seedGraduationData = async () => {
  try {
    await connectDB();

    const photoPaths = [
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784138389199.png', // Anchoring Suit front
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784138572727.jpg', // Anchoring profile
    ];

    const uploadedUrls = [];

    console.log('Uploading graduation/anchoring photos to Cloudinary...');
    for (let i = 0; i < photoPaths.length; i++) {
      console.log(`Uploading image ${i + 1}/${photoPaths.length}...`);
      const res = await cloudinary.uploader.upload(photoPaths[i], {
        folder: 'madanraj_portfolio/graduation',
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
    }
    console.log('Images uploaded successfully:', uploadedUrls);

    // Create Achievement
    console.log('Creating Graduation Achievement in MongoDB...');
    const titleText = 'Diploma in Computer Technology & General Secretary (95.09% Aggregate)';
    const achievementExists = await Achievement.findOne({ title: titleText });
    
    if (!achievementExists) {
      await Achievement.create({
        title: titleText,
        description: "Wrapped up a 3-year Diploma in Computer Technology, achieving an outstanding 95.09% aggregate score while maintaining the 1st rank for four consecutive semesters. Served as the General Secretary in the final year, leading college-wide activities, anchoring major events, and placing in the top 3 for paper and project presentations.",
        eventDetails: 'Academic Achievement & Student Council Leadership (General Secretary).',
        date: new Date('2026-06-15'),
        category: 'Academic Milestones',
        photos: uploadedUrls,
        certificateUrl: uploadedUrls[0],
        status: 'published',
        order: 5
      });
      console.log('Academic achievement registered in MongoDB!');
    } else {
      console.log('Academic achievement already exists, skipping.');
    }

    // Seed visual Gallery items
    console.log('Seeding visual Gallery items...');
    const galleryItems = [
      { title: 'General Secretary Anchoring College Event', mediaUrl: uploadedUrls[0] },
      { title: 'General Secretary Addressing Gathering', mediaUrl: uploadedUrls[1] }
    ];

    for (const item of galleryItems) {
      const exists = await GalleryItem.findOne({ mediaUrl: item.mediaUrl });
      if (!exists) {
        await GalleryItem.create({
          title: item.title,
          category: 'college',
          mediaUrl: item.mediaUrl,
          status: 'published'
        });
      }
    }
    console.log('Gallery records seeded!');

    // Update settings visibility to disable blogs completely
    console.log('Updating settings visibility to hide blogs section...');
    let settings = await Setting.findOne({});
    if (settings) {
      if (!settings.sectionVisibility) {
        settings.sectionVisibility = {};
      }
      settings.sectionVisibility.blogs = false;
      
      // Save changes securely
      await settings.save();
      console.log('Settings updated! Blogs section is now turned OFF globally.');
    } else {
      console.log('Warning: Settings document not found in DB!');
    }

    console.log('Graduation data seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to seed graduation data:', err.message);
    process.exit(1);
  }
};

seedGraduationData();
