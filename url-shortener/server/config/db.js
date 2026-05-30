const mongoose = require('mongoose');

let memoryServer;

const connectDB = async () => {
  const useDemoStore = process.env.DEMO_MODE === 'true' || (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI);

  if (useDemoStore) {
    console.warn('Running with temporary demo storage.');
    return null;
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url_shortener';
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully');
    return mongoose.connection;
  } catch (err) {
    if (isProduction) {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    }

    console.warn('Local MongoDB not available. Starting in-memory database for development.');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = memoryServer || await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log('Connected to in-memory MongoDB. Data resets when the server stops.');
    return mongoose.connection;
  }
};

module.exports = connectDB;
