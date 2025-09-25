import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import ErrorHandler from "./middlewares/errorHandling.js";

dotenv.config();
const app = express();
const logStream = fs.createWriteStream(path.join(process.cwd(), "access.log"), { flags: "a" });

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// -------- Middleware packages --------
app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form submissions
if (process.env.NODE_ENV === "production")
    app.use(morgan("combined", { stream: logStream })); // For request logging to file
else app.use(morgan("dev")); // For request logging to console 
app.use(helmet()); // For additional security headers
app.use(cors({ origin: `${FRONTEND_URL}` })); // Restrict requests to frontend

//  -------- Routers -------
import fileRouter from "./routes/fileStorage.js";
import roomRouter from "./routes/roomRouter.js";
import userRouter from "./routes/userRouter.js";

app.use("/api/file", fileRouter);
app.use("/api/room", roomRouter);
app.use("/api/user", userRouter);

//  ----- Server Healthcheck -----
app.get('/healthcheck', (req, res) => {
    res.status(200).json({ message: "Server working fine" });
})

// ------ Catch-all request handler ------
app.all('/{*any}', (req, res) => {
    res.status(404).json({ message: "404 Not found" });
})

app.use(ErrorHandler);

export { app };