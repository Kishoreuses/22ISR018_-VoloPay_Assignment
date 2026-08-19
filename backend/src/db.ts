import mongoose from 'mongoose';
import dns from 'dns';

// Force DNS resolution to use Google's DNS to prevent SRV lookup failures
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignored in restricted environments
}

let cachedConnection: typeof mongoose | null = null;

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Atlas connected');
    return cachedConnection;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed — using in-memory fallback:', err);
    return null;
  }
}
