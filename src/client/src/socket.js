import { io } from 'socket.io-client';

// backend URL
const URL = 'http://localhost:8000';

export const socket = io(URL, {
    autoConnect: false
});