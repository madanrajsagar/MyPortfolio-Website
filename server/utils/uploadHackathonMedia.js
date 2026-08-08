import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
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

const uploadHackathonMedia = async () => {
  try {
    await connectDB();

    const photoPaths = [
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784133543386.jpg', // Group on stage
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784133558913.jpg', // Madanraj holding cheque/trophy
      'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1784133583683.jpg', // Group selfie
    ];

    const uploadedUrls = [];

    console.log('Uploading 3 event photos to Cloudinary...');
    for (let i = 0; i < photoPaths.length; i++) {
      console.log(`Uploading image ${i + 1}/${photoPaths.length}...`);
      const res = await cloudinary.uploader.upload(photoPaths[i], {
        folder: 'madanraj_portfolio/hackathon',
        resource_type: 'image'
      });
      uploadedUrls.push(res.secure_url);
    }
    console.log('All images uploaded successfully:', uploadedUrls);

    // 1. Update Project Abhaya
    console.log('Updating project "Abhaya - Proactive Women Safety App" in MongoDB...');
    const project = await Project.findOne({ title: 'Abhaya - Proactive Women Safety App' });
    if (project) {
      project.githubLink = 'https://github.com/madanrajsagar/Abhaya.git';
      project.heroImage = uploadedUrls[1]; // Use Madanraj holding cheque as hero cover
      project.gallery = uploadedUrls;      // Add all 3 photos as gallery images
      await project.save();
      console.log('Project details successfully updated!');
    } else {
      console.log('Project "Abhaya" not found in DB!');
    }

    // 2. Update Achievement
    console.log('Updating Achievement in MongoDB...');
    const achievement = await Achievement.findOne({ title: '1st Runner-Up at D Y Patil National Hackathon' });
    if (achievement) {
      achievement.photos = uploadedUrls;
      achievement.certificateUrl = uploadedUrls[1]; // Use personal photo as cert/proof
      await achievement.save();
      console.log('Achievement photos successfully linked!');
    } else {
      console.log('Achievement not found in DB!');
    }

    // 3. Register items inside Media Gallery collection
    console.log('Seeding visual Gallery items...');
    const galleryItems = [
      { title: 'D.Y. Patil Hackathon Stage Group Picture', mediaUrl: uploadedUrls[0] },
      { title: '1st Runner-Up Trophy & Cheque Presentation', mediaUrl: uploadedUrls[1] },
      { title: 'Bit Manipulators Group Selfie', mediaUrl: uploadedUrls[2] }
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
    console.log('Seeded into portfolio media gallery collection!');

    console.log('Hackathon data binding process complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to bind hackathon data:', err.message);
    process.exit(1);
  }
};

uploadHackathonMedia();
