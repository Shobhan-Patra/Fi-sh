import { app } from '../app.js';

const SERVER_PORT = process.env.SERVER_PORT || 8000;

app.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log(`Server is listening`);
});
