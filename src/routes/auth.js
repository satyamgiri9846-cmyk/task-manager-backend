import { User } from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export default async function authRoutes(fastify) {
  // POST /auth/signup
  fastify.post('/signup', async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: 'email and password are required' });
    }
    if (password.length < 6) {
      return reply.code(400).send({ error: 'password must be at least 6 characters' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return reply.code(409).send({ error: 'email already registered' });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ email, password: hashed });

    // Never send the password (even hashed) back in the response.
    return reply.code(201).send({ id: user.id, email: user.email, role: user.role });
  });

  // POST /auth/login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Deliberately vague - don't reveal whether the email exists.
      return reply.code(401).send({ error: 'invalid email or password' });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return reply.code(401).send({ error: 'invalid email or password' });
    }

    const token = fastify.jwt.sign({ userId: user.id, role: user.role });
    return reply.send({ token });
  });
}
