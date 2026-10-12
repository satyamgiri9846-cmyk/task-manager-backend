import cors from '@fastify/cors';
import 'dotenv/config';
import Fastify from 'fastify';
import { connectDB, sequelize } from './utils/db.js';
import authPlugin from './plugins/auth.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import boardRoutes from './routes/boards.js';

// Import models so Sequelize registers them before sync()
import './models/User.js';
import './models/Task.js';
import './models/Board.js';
import './models/BoardMember.js';

const fastify = Fastify({ logger: true });

async function start() {
  await connectDB();

  // Creates tables automatically if they don't exist yet (dev only -
  // in production you'd use proper migrations instead of sync()).
  await sequelize.sync();

  await fastify.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
});
  
  await fastify.register(authPlugin);
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(taskRoutes, { prefix: '/boards' });
  await fastify.register(boardRoutes, { prefix: '/boards' });

  fastify.get('/health', async () => ({ status: 'ok' }));

  try {
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
