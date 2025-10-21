import { io } from 'socket.io-client';

// backend URL
const URL = import.meta.env.VITE_API_BASE_URL;

export const socket = io(URL, {
  autoConnect: false,
});
