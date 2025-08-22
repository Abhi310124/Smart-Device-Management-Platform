import express from 'express';
import {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  heartbeat,

} from '../controllers/device.controller.js';
import { protect } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { deviceSchema } from '../validators/device.schemas.js';
import cacheMiddleware from '../middlewares/cache.js';

const router = express.Router();

// All device routes are protected
router.use(protect);

// Define routes once with the correct controllers and middleware
router.post('/', validate(deviceSchema), createDevice);
router.patch('/:id', updateDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/heartbeat', heartbeat);

// Apply caching ONLY to the GET endpoint for listing devices
router.get('/', cacheMiddleware(900), getDevices); // Cache for 15 minutes

export default router;
