import { Task } from '../models/Task.js';
import { BoardMember } from '../models/BoardMember.js';

// Shared helper: confirms the logged-in user belongs to this board.
// Returns the membership row (with its role) if so, otherwise null.
async function getMembership(boardId, userId) {
  return BoardMember.findOne({ where: { boardId, userId } });
}

export default async function taskRoutes(fastify) {
  fastify.addHook('preHandler', fastify.authenticate);

  // GET /boards/:boardId/tasks - all tasks on a board (any member can view)
  fastify.get('/:boardId/tasks', async (request, reply) => {
    const { boardId } = request.params;
    const membership = await getMembership(boardId, request.user.userId);
    if (!membership) {
      return reply.code(403).send({ error: 'You are not a member of this board' });
    }
    return Task.findAll({ where: { boardId } });
  });

  // POST /boards/:boardId/tasks - create a task on a board (any member)
  fastify.post('/:boardId/tasks', async (request, reply) => {
    const { boardId } = request.params;
    const membership = await getMembership(boardId, request.user.userId);
    if (!membership) {
      return reply.code(403).send({ error: 'You are not a member of this board' });
    }

    const { title, description, status } = request.body;
    if (!title) return reply.code(400).send({ error: 'title is required' });

    const task = await Task.create({
      title,
      description,
      status,
      boardId,
      createdBy: request.user.userId,
    });
    return reply.code(201).send(task);
  });

  // PATCH /boards/:boardId/tasks/:id - update a task (any member)
  fastify.patch('/:boardId/tasks/:id', async (request, reply) => {
    const { boardId, id } = request.params;
    const membership = await getMembership(boardId, request.user.userId);
    if (!membership) {
      return reply.code(403).send({ error: 'You are not a member of this board' });
    }

    const task = await Task.findOne({ where: { id, boardId } });
    if (!task) return reply.code(404).send({ error: 'task not found' });

    await task.update(request.body);
    return task;
  });

  // DELETE /boards/:boardId/tasks/:id - only the board OWNER can delete
  fastify.delete('/:boardId/tasks/:id', async (request, reply) => {
    const { boardId, id } = request.params;
    const membership = await getMembership(boardId, request.user.userId);
    if (!membership) {
      return reply.code(403).send({ error: 'You are not a member of this board' });
    }
    if (membership.role !== 'OWNER') {
      return reply.code(403).send({ error: 'Only the board owner can delete tasks' });
    }

    const task = await Task.findOne({ where: { id, boardId } });
    if (!task) return reply.code(404).send({ error: 'task not found' });

    await task.destroy();
    return reply.code(204).send();
  });
}