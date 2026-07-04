const jwt = require('jsonwebtoken');
require('dotenv').config();

let io = null;

function init(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: token required'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        id: payload.id,
        role: payload.role,
        ministry_id: payload.ministry_id
      };
      return next();
    } catch (err) {
      return next(new Error('Authentication error: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user_${socket.user.id}`);
    socket.join(`role_${socket.user.role}`);
    if (socket.user.ministry_id) socket.join(`ministry_${socket.user.ministry_id}`);
    if (socket.user.role === 'admin') socket.join('all');

    socket.on('join', (room, ack) => {
      if (!room || typeof room !== 'string') {
        if (ack) ack({ ok: false, error: 'invalid_room' });
        return;
      }
      const allowed = validateJoin(socket, room);
      if (!allowed) {
        if (ack) ack({ ok: false, error: 'not_allowed' });
        return;
      }
      socket.join(room);
      if (ack) ack({ ok: true });
    });
  });
}

function validateJoin(socket, room) {
  if (room === 'all') {
    return socket.user && socket.user.role === 'admin';
  }
  if (room.startsWith('ministry_')) {
    const id = room.split('_')[1];
    return socket.user && (socket.user.role === 'admin' || socket.user.ministry_id === id);
  }
  if (room.startsWith('user_')) {
    const id = room.split('_')[1];
    return socket.user && (socket.user.role === 'admin' || socket.user.id === id);
  }
  if (room.startsWith('role_')) {
    const role = room.split('_')[1];
    return socket.user && socket.user.role === role;
  }
  return false;
}

function emitAnnouncement(announcement) {
  if (!io) return;
  const { target_audience, target_value } = announcement;

  if (target_audience === 'all') {
    io.to('all').emit('announcement', announcement);
  } else if (target_audience === 'ministry') {
    io.to(`ministry_${target_value}`).emit('announcement', announcement);
  } else if (target_audience === 'user') {
    io.to(`user_${target_value}`).emit('announcement', announcement);
  } else if (target_audience === 'role') {
    io.to(`role_${target_value}`).emit('announcement', announcement);
  }
}

module.exports = { init, emitAnnouncement };
