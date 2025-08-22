import express from 'express';
import exportController from '../controllers/export.controller.js';
import { protect } from '../middlewares/auth.js';
// Add validation schema if needed

const router = express.Router();

// All export routes are protected
router.use(protect);

router.post('/', exportController.requestExport);
router.get('/:jobId/status', exportController.getExportStatus);
router.get('/:jobId/download', exportController.downloadExport);

export default router;