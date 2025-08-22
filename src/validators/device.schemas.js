// src/validators/device.schemas.js
import Joi from 'joi';

const deviceSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(1).required(),
    type: Joi.string().valid('light', 'thermostat', 'smart_meter', 'lock').required(),
    status: Joi.string().valid('active', 'inactive', 'offline').optional(),
  }),
});

export { deviceSchema };
