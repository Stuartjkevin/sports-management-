// Vercel entry point: Vercel runs this file as a serverless function and
// passes every request to the Express app (vercel.json sends all paths here).
// The MongoDB connection opens on the first request and is reused while warm.
import app from '../src/app.js';

export default app;
