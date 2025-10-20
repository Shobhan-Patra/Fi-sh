import db from "../db/db.js";

export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('\x1b[36m%s\x1b[0m', "A user connected: ", socket.id);

        socket.on('room:join', async ({ roomId, userId, displayName }) => {
            socket.join(roomId);
            socket.roomId = roomId;
            socket.displayName = displayName;
            socket.userId = userId;

            socket.to(roomId).emit('user-joined', {
                userId: userId,
                displayName: displayName,
            });

            console.log('\x1b[36m%s\x1b[0m', `User ${socket.userId} joined room ${roomId}`);
        })

        socket.on('room:leave', () => {
            const { roomId, userId, displayName} = socket;
            console.log('\x1b[36m%s\x1b[0m', `User ${userId} left room ${roomId}`);

            socket.to(roomId).emit('user-left', {
                userId: userId,
                displayName: displayName
            });
            socket.leave(roomId);
        })

        socket.on('disconnect', async () => {
            const { roomId, displayName} = socket;

            if (!roomId) {
                console.log('\x1b[36m%s\x1b[0m', `Anonymous user disconnected: `, socket.id)
                return;
            }
            console.log('\x1b[36m%s\x1b[0m', `User ${displayName} disconnected from room ${roomId}: `, socket.id);

            io.to(roomId).emit('user-left', {
                userId: socket.userId,
                displayName: socket.displayName
            });
        })
    })
}