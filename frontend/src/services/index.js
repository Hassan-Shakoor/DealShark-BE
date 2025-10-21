import authService from './authService.js';
import dealsService from './dealsService.js';
import referralsService from './referralsService.js';
import uploadService from './uploadService.js';

// Export all services
export { default as api, tokenManager, API_ENDPOINTS } from './api.js';
export { default as authService } from './authService.js';
export { default as dealsService } from './dealsService.js';
export { default as referralsService } from './referralsService.js';
export { default as uploadService } from './uploadService.js';

// Create a services object for easy access
export const services = {
  auth: authService,
  deals: dealsService,
  referrals: referralsService,
  upload: uploadService,
};

export default services;
