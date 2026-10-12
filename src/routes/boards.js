import { Board } from '../models/Board.js';
import { BoardMember } from '../models/BoardMember.js';
import { User } from '../models/User.js';

export default async function boardRoutes(fastify) {
  // Every route here requires a valid JWT
  fastify.addHook('preHandler', fastify.authenticate);

  // POST /boards - create a new board, creator becomes OWNER
  fastify.post('/', async (request, reply) => {
    const { name } = request.body;
    if (!name) return reply.code(400).send({ error: 'name is required' });

    const board = await Board.create({ name, ownerId: request.user.userId });

    // Automatically add the creator as a member with OWNER role
    await BoardMember.create({
      boardId: board.id,
      userId: request.user.userId,
      role: 'OWNER',
    });

    return reply.code(201).send(board);
  });

  // GET /boards - list boards the logged-in user is a member of
  fastify.get('/', async (request) => {
    const memberships = await BoardMember.findAll({
      where: { userId: request.user.userId },
      include: [{ model: Board }],
    });
    return memberships.map((m) => ({
      ...m.Board.toJSON(),
      myRole: m.role,
    }));
  });

  // POST /boards/:id/invite - add a user to a board by email
  fastify.post('/:id/invite', async (request, reply) => {
    const boardId = request.params.id;
    const { email } = request.body;
    if (!email) return reply.code(400).send({ error: 'email is required' });

    // Only an OWNER of this specific board can invite others
    const myMembership = await BoardMember.findOne({
      where: { boardId, userId: request.user.userId },
    });
    if (!myMembership || myMembership.role !== 'OWNER') {
      return reply.code(403).send({ error: 'Only the board owner can invite members' });
    }

    const userToInvite = await User.findOne({ where: { email } });
    if (!userToInvite) {
      return reply.code(404).send({ error: 'No user with that email' });
    }

    const alreadyMember = await BoardMember.findOne({
      where: { boardId, userId: userToInvite.id },
    });
    if (alreadyMember) {
      return reply.code(409).send({ error: 'User is already a member of this board' });
    }

    const membership = await BoardMember.create({
      boardId,
      userId: userToInvite.id,
      role: 'MEMBER',
    });

    return reply.code(201).send(membership);
  });
}