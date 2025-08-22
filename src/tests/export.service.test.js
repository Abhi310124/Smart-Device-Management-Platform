// src/tests/export.service.test.js
import { startExportJob, getJobStatus } from '../services/export.service.js';
import jobStore from '../jobStore.js';
import mongoose from 'mongoose';
import Device from '../models/device.model.js';
import Log from '../models/log.model.js'; // Import the Log model

// Mock both models to prevent any real database calls
jest.mock('../models/device.model.js');
jest.mock('../models/log.model.js'); // ** FIX 1: Mock the Log model **

describe('Export Service - Unit Tests', () => {
  beforeEach(() => {
    jobStore.clear();
    // Reset all mocks before each test
    Device.findOne.mockClear();
    Log.find.mockClear();
  });

  it('should start an export job and return a job ID', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const deviceId = new mongoose.Types.ObjectId().toString();

    // Simulate finding the device successfully
    Device.findOne.mockResolvedValue({ _id: deviceId, owner: userId });
    // ** FIX 2: Simulate finding zero logs successfully **
    Log.find.mockReturnValue({ lean: () => Promise.resolve([]) });

    const exportParams = {
      deviceId,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      format: 'json',
    };

    const jobId = startExportJob(userId, exportParams);

    expect(typeof jobId).toBe('string');
    const job = getJobStatus(jobId);
    expect(job).toBeDefined();
    expect(job.status).toBe('pending');

    // Add a small delay to allow the async processExport to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const finalJob = getJobStatus(jobId);
    // The job should now be complete because the mocked DB calls were instant
    expect(finalJob.status).toBe('complete');
  });
});
