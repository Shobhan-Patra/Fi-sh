import db from "../db/db.js";

export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('\x1b[36m%s\x1b[0m', "A user connected: ", socket.id);

        socket.on('room:join', async ({ roomId, userId, display_name }) => {
            socket.join(roomId);
            socket.roomId = roomId;
            socket.display_name = display_name;
            socket.userId = userId;

            console.log('\x1b[36m%s\x1b[0m', `User ${socket.userId} joined room ${roomId}`);
        })

        socket.on('room:leave', () => {
            const { roomId, userId, display_name} = socket;
            console.log('\x1b[36m%s\x1b[0m', `User: ${userId} (${display_name}) left room: ${roomId}`);

            socket.leave(roomId);
        })

        socket.on('disconnect', async () => {
            const { roomId, userId, display_name} = socket;

            if (!roomId) {
                console.log('\x1b[36m%s\x1b[0m', `Anonymous user disconnected: `, socket.id)
                return;
            }
            console.log('\x1b[36m%s\x1b[0m', `User ${display_name} disconnected from room ${roomId}: `, socket.id);

            if (userId && display_name) {
                io.to(roomId).emit('user-left', {
                    userId: userId,
                    display_name: display_name
                });
            }
        })
    })
}