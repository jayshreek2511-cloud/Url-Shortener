const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url_shortener';

  try {
    // Try connecting to the configured MongoDB instance
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('💾 Connected to MongoDB successfully');
  } catch (err) {
    console.warn('⚠️  Local MongoDB not available. Starting in-memory database...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('💾 Connected to in-memory MongoDB successfully');
      console.log('   ℹ️  Data will not persist after server restart');
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
