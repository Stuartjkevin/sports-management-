// Builds the Express app (kept separate from server.js so it is easy to test).
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet()); // sets safe HTTP headers
app.use(cors({ origin: env.clientUrl })); // only the React app may call this API from a browser
app.use(express.json({ limit: '100kb' })); // parses JSON request bodies into req.body
if (env.nodeEnv !== 'test') app.use(requestLogger);

app.get('/', (req, res) => res.json({ message: 'Sport Team Portal API. See /api/health' }));
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
