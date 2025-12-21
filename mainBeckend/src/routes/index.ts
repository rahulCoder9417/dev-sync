import express, { Request, Response } from 'express';
import { gitCloneController } from './gitCloneController';
import { formParser } from '../utils/multer';
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

router.post('/git/clonePublicRepo',formParser.none(), gitCloneController);

export default router;
