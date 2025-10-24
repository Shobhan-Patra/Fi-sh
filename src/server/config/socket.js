let disconnectTimers = new Map();

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('\x1b[36m%s\x1b[0m', 'A user connected: ', socket.id);

    socket.on('room:join', async ({ roomId, userId, display_name }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.display_name = display_name;
      socket.userId = userId;

      console.log(
        '\x1b[36m%s\x1b[0m',
        `User ${socket.userId} joined room ${roomId}`
      );

      if (disconnectTimers.has(userId)) {
        clearTimeout(disconnectTimers.get(userId));
        disconnectTimers.delete(userId);
        console.log(`User ${display_name} reconnected within the grace period. Timer cancelled.`);      }
    });

    socket.on('room:leave', () => {
      const { roomId, userId, display_name } = socket;
      console.log(
        '\x1b[36m%s\x1b[0m',
        `User: ${userId} (${display_name}) left room: ${roomId}`
      );

      socket.leave(roomId);
    });

    socket.on('disconnect', async () => {
      const { roomId, userId, display_name } = socket;

      if (!roomId) {
        console.log(
          '\x1b[36m%s\x1b[0m',
          `Anonymous user disconnected: `,
          socket.id
        );
        return;
      }
      console.log(
        '\x1b[36m%s\x1b[0m',
        `User ${display_name} disconnected from room ${roomId}: `,
        socket.id
      );

      const timer = setTimeout(() => {
        console.log(`Grace period ended for ${display_name}: ${userId} `);
        io.to(roomId).emit('user-left', {
          userId: userId,
          display_name: display_name
        });
        // roomOccupants.get(roomId)?.delete(userId);
        disconnectTimers.delete(userId);
      }, 5000);

      disconnectTimers.set(userId, timer);
    });
  });
};
