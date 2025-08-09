import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket from 'ws';
import config from './src/config/index.js';
import router from './src/routes/index.js';
import WebSocketHandler from './src/websocket/wsHandler.js';

const app = express();
const server = http.createServer(app);
const wsHandler = new WebSocketHandler();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', router);
app.get('/rooms', (req: Request, res: Response) => {
  res.json({
    rooms: wsHandler.getRoomStats(),
    timestamp: new Date().toISOString()
  });
});

// WebSocket
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws: WebSocket) => wsHandler.handleConnection(ws));

// Graceful shutdown
const shutdown = (): void => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
