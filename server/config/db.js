import mongoose from 'mongoose';
import dns from 'dns';

// Force Node's DNS resolver to resolve IPv4 addresses first.
dns.setDefaultResultOrder('ipv4first');

// Programmatically use Google and Cloudflare DNS servers for resolving queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Programmatic DNS override active: Routing lookups through 8.8.8.8 and 1.1.1.1');
} catch (e) {
  console.warn('Programmatic DNS setServers failed, falling back to OS settings:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.log('\n=========================================');
      console.log('TIP: This querySrv ECONNREFUSED DNS lookup error is common on certain ISPs/DNS servers.');
      console.log('To resolve this, you can:');
      console.log('1. Change your local machine/network DNS to Google DNS (8.8.8.8 and 8.8.4.4) or Cloudflare DNS (1.1.1.1).');
      console.log('2. If you are behind a restricted network/VPN, use the fallback connection string format (non-srv) from MongoDB Atlas.');
      console.log('=========================================\n');
    }

    // Exiting process on connection failure in production, but let's log it
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
