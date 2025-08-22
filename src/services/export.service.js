import { v4 as uuidv4 } from 'uuid';
import jobStore from '../jobStore.js';
import Log from '../models/log.model.js';
import Device from '../models/device.model.js';
import { Parser } from 'json2csv';

const startExportJob = (userId, { deviceId, startDate, endDate, format }) => {
  const jobId = uuidv4();
  jobStore.set(jobId, { status: 'pending', file: null, error: null });
  console.log(`[Export Job ${jobId}] Started for user ${userId}`);

  // Run the export process in the background (don't await it here)
  processExport(jobId, userId, { deviceId, startDate, endDate, format });

  return jobId;
};

const processExport = async (jobId, userId, { deviceId, startDate, endDate, format }) => {
  try {
    // 1. Verify user owns the device (NOTE: use owner_id, matching device.model.js)
    const device = await Device.findOne({ _id: deviceId, owner_id: userId });
    if (!device) {
      throw new Error('Device not found or not owned by user.');
    }

    // 2. Fetch logs within the date range
    const query = {
      device: deviceId,
      timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };
    const logs = await Log.find(query).lean();

    if (logs.length === 0) {
      jobStore.set(jobId, { status: 'complete', file: { content: '', format }, error: null });
      console.log(`[Export Job ${jobId}] Complete: No logs found for the given range.`);
      return;
    }

    // 3. Convert data to desired format
    let fileContent;
    if (format === 'csv') {
      const json2csvParser = new Parser();
      fileContent = json2csvParser.parse(logs);
    } else { // Default JSON
      fileContent = JSON.stringify(logs, null, 2);
    }

    // 4. Update job store with result
    jobStore.set(jobId, { status: 'complete', file: { content: fileContent, format }, error: null });
    console.log(`[Export Job ${jobId}] Successfully completed.`);

    // 5. Simulate email notification
    console.log(`--> SIMULATING EMAIL: Sent notification to user ${userId} for export job ${jobId}.`);

  } catch (error) {
    console.error(`[Export Job ${jobId}] Failed:`, error);
    jobStore.set(jobId, { status: 'failed', file: null, error: error.message });
  }
};

const getJobStatus = (jobId) => {
  return jobStore.get(jobId);
};

export { startExportJob, getJobStatus };
