// Entry point: starts the HTTP server.
import app from './app.js';
import { env } from './config/env.js';
import { MongoClient } from 'mongodb';

if (!env.mongoUri) {
  throw new Error('MONGODB_URI is missing in backend/.env.');
}

const mongoClient = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 10000 });

try {
  await mongoClient.connect();
  await mongoClient.db(env.mongoDbName).command({ ping: 1 });
  console.log(`MongoDB connected (database: ${env.mongoDbName})`);

  const server = app.listen(env.port, () => {
    console.log(`API running at http://localhost:${env.port}  (storage: in-memory, data resets on restart)`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Stop the other process or change PORT in backend/.env.`);
      process.exitCode = 1;
    } else {
      throw err;
    }
  });

  const shutdown = async () => {
    await mongoClient.close();
    server.close();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch (error) {
  await mongoClient.close();
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exitCode = 1;
}
