import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Education from './models/Education.js';

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    console.log('Clearing existing Education entries...');
    await Education.deleteMany({});

    console.log('Inserting updated Education timeline records...');
    const records = [
      {
        order: 1,
        institution: 'Walchand College of Engineering, Sangli',
        degree: 'B.Tech in Artificial Intelligence & Machine Learning',
        fieldOfStudy: 'Artificial Intelligence & Machine Learning',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2028-06-30'),
        cgpa: 9.29,
        currentYear: '2025 – 2028',
        highlight: 'btech',
        achievements: [
          'CGPA: 9.29',
          'Consistently strong academic performance',
          'Active involvement in GDG WCE and technical activities',
          'Building expertise in AI/ML, software development, and problem solving',
        ],
        status: 'published',
      },
      {
        order: 2,
        institution: 'Government Polytechnic Sakoli',
        degree: 'Diploma in Computer Technology',
        fieldOfStudy: 'Computer Engineering',
        startDate: new Date('2022-08-01'),
        endDate: new Date('2025-06-30'),
        marks: 95.09,
        currentYear: '2022 – 2025',
        highlight: 'diploma',
        achievements: [
          '95.09% aggregate',
          'College Topper — Rank 1',
          'Maintained Rank 1 for four consecutive semesters',
          'Maharashtra State Board Rank: 330',
          'Developed a strong foundation in programming, computer science, and mathematics',
        ],
        status: 'published',
      },
    ];

    await Education.insertMany(records);
    console.log('Successfully inserted 2 education timeline records into MongoDB!');
  } catch (err) {
    console.error('Error updating education DB:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
