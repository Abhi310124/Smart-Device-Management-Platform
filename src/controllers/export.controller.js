import { startExportJob, getJobStatus } from '../services/export.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

const requestExport = asyncHandler(async (req, res) => {
  const { deviceId, startDate, endDate, format = 'json' } = req.body;
  // Await the async job start function for proper error handling
  const jobId = await startExportJob(req.user.id, { deviceId, startDate, endDate, format });

  res.status(202).json(new ApiResponse(202, { jobId }, "Export job has been accepted and is running in the background."));
});

const getExportStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = getJobStatus(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  res.status(200).json(new ApiResponse(200, { status: job.status, error: job.error }));
});

const downloadExport = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = getJobStatus(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found.");
  }
  if (job.status !== 'complete') {
    throw new ApiError(400, `Job is not complete. Current status: ${job.status}`);
  }
  if (job.error) {
    throw new ApiError(500, `Job failed with an error: ${job.error}`);
  }

  const { content, format } = job.file;
  const filename = `export-${jobId}.${format}`;

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
  res.send(content);
});

export default {
  requestExport,
  getExportStatus,
  downloadExport,
};
