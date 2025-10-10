import { app } from '../app.js';

const SERVER_PORT = process.env.SERVER_PORT;

app.listen(SERVER_PORT, (req, res) => {
  // console.log(`Server listening at http://localhost:${SERVER_PORT}`);
});
