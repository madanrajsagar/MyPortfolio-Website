import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Set up DNS overrides to avoid local connection drops
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const reset = async () => {
  try {
    await connectDB();
    console.log('Clearing old user records...');
    await User.deleteMany({});

    console.log('Registering fresh admin account...');
    await User.create({
      username: 'madanraj',
      email: 'madanrajsagar83@gmail.com',
      password: 'adminpassword123' // Hashed by User model hook
    });

    console.log('Admin account successfully reset!');
    console.log('Username: madanraj');
    console.log('Password: adminpassword123');
    mongoose.connection.close();
  } catch (err) {
    console.error('Failed to reset admin account:', err.message);
    process.exit(1);
  }
};

reset();
