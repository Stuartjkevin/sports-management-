// Entry point for running the API as a normal server (local / Render).
// On Vercel, api/index.js is used instead and no server is started.
import app from './app.js';
import { env } from './config/env.js';
import { getDb, closeDb } from './config/db.js';

try {
  await (await getDb()).command({ ping: 1 });
  console.log(`MongoDB connected (database: ${env.mongoDbName})`);

  const server = app.listen(env.port, () => {
    console.log(`API running at http://localhost:${env.port}  (storage: MongoDB Atlas)`);
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
    await closeDb();
    server.close();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch (error) {
  await closeDb();
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exitCode = 1;
}
