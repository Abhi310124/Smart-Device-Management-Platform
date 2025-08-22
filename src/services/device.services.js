// src/services/device.service.js
import Device from '../models/device.model.js';
import { clearDeviceCache } from './cache.service.js'; // Import the invalidation service
import { broadcastToUser } from '../websockets.js';

// --- Helper function to find a device and verify ownership ---
const findDeviceOwnedByUser = async (deviceId, ownerId) => {
  const device = await Device.findOne({ _id: deviceId, owner: ownerId });
  if (!device) {
    throw new Error('Device not found or not owned by user');
  }
  return device;
};

const createDevice = async (deviceData) => {
  const device = await Device.create(deviceData);
  // Invalidate cache since the device list has changed
  await clearDeviceCache(device.owner.toString());
  return device;
};

const getUserDevices = async (ownerId, filters) => {
  const where = { owner: ownerId };
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  return Device.find(where);
};

const updateDeviceDetails = async (deviceId, ownerId, updateData) => {
  const device = await findDeviceOwnedByUser(deviceId, ownerId);
  Object.assign(device, updateData);
  await device.save();
  // Invalidate cache since a device has been updated
  await clearDeviceCache(ownerId);
  return device;
};

const deleteDevice = async (deviceId, ownerId) => {
  const device = await findDeviceOwnedByUser(deviceId, ownerId);
  await device.remove();
  // Invalidate cache since a device has been removed
  await clearDeviceCache(ownerId);
};

const recordDeviceHeartbeat = async (deviceId, ownerId, status) => {
  const device = await findDeviceOwnedByUser(deviceId, ownerId);
  device.last_active_at = new Date();
  if (status) device.status = status;
  await device.save();

  // Broadcast the status update to the device owner
  const message = {
    type: 'DEVICE_STATUS_UPDATE',
    payload: {
      deviceId: device._id,
      status: device.status,
      last_active_at: device.last_active_at,
    },
  };
  broadcastToUser(ownerId, message);
  console.log(`Broadcasted heartbeat for device ${deviceId} to user ${ownerId}`);

  return device;
};

const deactivateInactiveDevices = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // This is a system-wide operation and doesn't require individual cache invalidation
  // as it's not triggered by a specific user action. The cache will naturally expire.
  return Device.updateMany(
    { last_active_at: { $lt: twentyFourHoursAgo }, status: 'active' },
    { $set: { status: 'inactive' } }
  );
};

export {
  createDevice,
  getUserDevices,
  updateDeviceDetails,
  deleteDevice,
  recordDeviceHeartbeat,
  deactivateInactiveDevices,
  findDeviceOwnedByUser,
};
