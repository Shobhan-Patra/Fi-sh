import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "../app.js";
import { initializeSocket } from "./socket.js";
import fileRouter from '../routes/fileStorage.js';
import roomRouter from '../routes/roomRouter.js';
import userRouter from '../routes/userRouter.js';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
  }
});

initializeSocket(io);

app.use((req, res, next) => {
    req.io = io;
    next();
});

//  -------- Routers -------
app.use('/api/file', fileRouter);
app.use('/api/room', roomRouter);
app.use('/api/user', userRouter);

const PORT = process.env.SERVER_PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});