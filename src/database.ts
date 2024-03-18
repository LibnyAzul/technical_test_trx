import mongoose, { ConnectOptions } from 'mongoose';
import config from './config';

(async () => {
  const mongooseOpts: ConnectOptions = {
    dbName: config.MONGO_DATABASE,
    // user: config.MONGO_USER,
    // pass: config.MONGO_PASSWORD
  };
  try {
    const db = await mongoose.connect(
      `mongodb://${config.MONGO_HOST}`,
      mongooseOpts
    );
    console.log('Database is connected to: ', db.connection.name);
  } catch (error) {
    console.error('Database connection error: ', error);
  }
})();
