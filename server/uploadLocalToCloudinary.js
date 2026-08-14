import mongoose from 'mongoose';
import 'dotenv/config';
import Project from './models/Project.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadLocalToCloudinary = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to scan.`);

    for (let project of projects) {
      console.log(`Processing project: ${project.title}`);
      let updated = false;

      // 1. Process heroImage
      if (project.heroImage && (project.heroImage.startsWith('http://localhost') || project.heroImage.startsWith('/uploads'))) {
        const filename = path.basename(project.heroImage);
        const localPath = path.join(__dirname, 'uploads', filename);
        if (fs.existsSync(localPath)) {
          console.log(`Uploading local heroImage: ${filename} to Cloudinary...`);
          const uploadResult = await cloudinary.uploader.upload(localPath, {
            folder: 'madanraj_portfolio/projects',
          });
          project.heroImage = uploadResult.secure_url;
          updated = true;
          console.log(`Uploaded! New URL: ${project.heroImage}`);
        } else {
          console.warn(`Local file not found for heroImage: ${localPath}`);
        }
      }

      // 2. Process gallery
      if (project.gallery && project.gallery.length > 0) {
        const newGallery = [];
        for (let imgUrl of project.gallery) {
          if (imgUrl.startsWith('http://localhost') || imgUrl.startsWith('/uploads')) {
            const filename = path.basename(imgUrl);
            const localPath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(localPath)) {
              console.log(`Uploading local gallery image: ${filename} to Cloudinary...`);
              const uploadResult = await cloudinary.uploader.upload(localPath, {
                folder: 'madanraj_portfolio/projects',
              });
              newGallery.push(uploadResult.secure_url);
              updated = true;
              console.log(`Uploaded! New URL: ${uploadResult.secure_url}`);
            } else {
              console.warn(`Local file not found for gallery image: ${localPath}`);
              newGallery.push(imgUrl); // retain original if file missing
            }
          } else {
            newGallery.push(imgUrl);
          }
        }
        project.gallery = newGallery;
      }

      if (updated) {
        await project.save();
        console.log(`Saved project: ${project.title} with Cloudinary URLs.`);
      }
    }

    mongoose.disconnect();
    console.log('Finished uploading local assets to Cloudinary successfully!');
  } catch (err) {
    console.error('Error during migration:', err);
  }
};

uploadLocalToCloudinary();
