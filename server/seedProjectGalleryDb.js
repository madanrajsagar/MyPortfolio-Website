import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dns from 'dns';
import Project from './models/Project.js';
import Achievement from './models/Achievement.js';
import { uploadImage } from './services/cloudinaryService.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const travelnestImages = [
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/1.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/2.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 024509.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 024528.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 024619.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 024648.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 024721.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 025127.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/travelnest/Screenshot 2026-08-05 025347.png',
];

const msbteImages = [
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/msbte/Picture1.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/msbte/Picture2.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/msbte/Picture3.png',
  'C:/Users/ADMIN/Desktop/Madanraj portfolio/client/public/portfolio/projects/msbte/Picture4.png',
];

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // 1. Update TravelNest gallery
    const travelNest = await Project.findOne({ title: /TravelNest/i });
    if (travelNest) {
      console.log('Uploading Cloudinary images for TravelNest...');
      const uploadedUrls = [];
      for (const imgPath of travelnestImages) {
        if (fs.existsSync(imgPath)) {
          const buffer = fs.readFileSync(imgPath);
          const fakeFile = { path: imgPath, originalname: path.basename(imgPath), mimetype: 'image/png', buffer };
          const cdnUrl = await uploadImage(fakeFile, 'projects');
          if (cdnUrl) uploadedUrls.push(cdnUrl);
        }
      }
      if (uploadedUrls.length > 0) {
        travelNest.gallery = uploadedUrls;
        travelNest.heroImage = uploadedUrls[0];
        await travelNest.save();
        console.log(`✅ Updated TravelNest with ${uploadedUrls.length} Cloudinary gallery images!`);
      }
    }

    // 2. Update MSBTE Navigator gallery
    const msbte = await Project.findOne({ title: /MSBTE Navigator/i });
    if (msbte) {
      console.log('Uploading Cloudinary images for MSBTE Navigator...');
      const uploadedMsbteUrls = [];
      for (const imgPath of msbteImages) {
        if (fs.existsSync(imgPath)) {
          const buffer = fs.readFileSync(imgPath);
          const fakeFile = { path: imgPath, originalname: path.basename(imgPath), mimetype: 'image/png', buffer };
          const cdnUrl = await uploadImage(fakeFile, 'projects');
          if (cdnUrl) uploadedMsbteUrls.push(cdnUrl);
        }
      }
      if (uploadedMsbteUrls.length > 0) {
        msbte.gallery = uploadedMsbteUrls;
        msbte.heroImage = uploadedMsbteUrls[0];
        await msbte.save();
        console.log(`✅ Updated MSBTE Navigator with ${uploadedMsbteUrls.length} Cloudinary gallery images!`);
      }
    }

  } catch (err) {
    console.error('Error seeding project images:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
