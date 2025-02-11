const express = require('express');
const cors = require('cors');
const http = require('http');
const db = require('./db');
const songsRouter = require('./Controllers/songs');
const descriptionsRouter = require('./Controllers/descriptions');
const camerasRouter = require('./Controllers/cameras');
const shotsRouter = require('./Controllers/shots');
const loginRouter = require('./Controllers/Auth/login');
const setupWebSocket = require('./Controllers/websocket');
const authenticateToken = require('./Controllers/Auth/authenticateToken');
const teamsRouter = require('./Controllers/teams');
const overviewRouter = require('./Controllers/overview');
const userRouter = require('./Controllers/users');
const eventsRouter = require('./Controllers/events');
const contactRouter = require('./Controllers/contact');
const registerRouter = require('./Controllers/Auth/register');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/contact', contactRouter);

app.use('/users', authenticateToken, userRouter);
app.use('/teams', authenticateToken, teamsRouter);
app.use('/overview', authenticateToken, overviewRouter);
app.use('/songs', authenticateToken, songsRouter);
app.use('/descriptions', authenticateToken, descriptionsRouter);
app.use('/cameras', authenticateToken, camerasRouter);
app.use('/shots', authenticateToken, shotsRouter);
app.use('/events', authenticateToken, eventsRouter);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});