import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Setting from '../models/Setting.js';

// Setup DNS overrides for MongoDB connection
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'djhoiggsv',
  api_key: process.env.CLOUDINARY_API_KEY || '255314377583214',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'TBntNFuNicu7JwNznuJ7SXA08rI',
});

const uploadAvatar = async () => {
  try {
    await connectDB();
    
    const localFilePath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/571ce939-0c1a-46db-8f9e-6756cf185809/media__1783958616653.png';
    console.log('Uploading photo to Cloudinary secure storage...');

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'madanraj_portfolio/branding',
      resource_type: 'image'
    });

    console.log('Cloudinary secure URL:', result.secure_url);

    console.log('Linking picture URL in portfolio MongoDB settings...');
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = new Setting();
    }

    if (!settings.homeHero) {
      settings.homeHero = {};
    }

    settings.homeHero.profileImage = result.secure_url;
    await settings.save();

    console.log('Portfolio profile picture successfully linked and saved!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Upload failed:', err.message);
    process.exit(1);
  }
};

uploadAvatar();
