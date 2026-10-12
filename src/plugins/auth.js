import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

/**
 * Registers @fastify/jwt on the app, and adds a reusable
 * `authenticate` decorator that protected routes can use.
 */
export default fp(async function authPlugin(fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-this-in-production',
    sign: { expiresIn: '30m' }, // access tokens expire quickly
  });

  // Usage in a route: { preHandler: [fastify.authenticate] }
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify(); // throws if token missing/invalid/expired
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized', message: err.message });
    }
  });

  // Usage: { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }
  fastify.decorate('requireRole', function (role) {
  return async function (request, reply) {
      if (request.user.role !== role) {
        reply.code(403).send({ error: 'Forbidden', message: 'Insufficient permissions' });
      }
    };
  });
});
