import express, { Request, Response } from 'express';
const router = express.Router();

// Health check route
router.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Backend WS server is running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// API status route
router.get('/status', (req: Request, res: Response) => {
  res.json({
    server: 'running',
    websocket: 'active',
    timestamp: new Date().toISOString()
  });
});

export default router;
