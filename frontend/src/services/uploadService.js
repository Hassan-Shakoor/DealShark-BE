import toast from 'react-hot-toast';
import { apiFormData, API_ENDPOINTS } from './api.js';

// Upload service
export const uploadService = {
  // Upload single file
  uploadFile: async (file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiFormData(API_ENDPOINTS.UPLOAD, formData, {
        onUploadProgress: onProgress,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'File uploaded successfully.',
          file: response.data,
          url: response.data.url || response.data.file_url,
        };
      }

      throw new Error('Failed to upload file. Invalid response from server.');
    } catch (error) {
      console.error('Upload file error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file. Please try again.',
      };
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, onProgress = null) => {
    try {
      const formData = new FormData();
      
      // Append all files to form data
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await apiFormData(API_ENDPOINTS.UPLOAD, formData, {
        onUploadProgress: onProgress,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Files uploaded successfully.',
          files: response.data.files || [response.data],
          urls: response.data.urls || response.data.files?.map(f => f.url) || [response.data.url],
        };
      }

      throw new Error('Failed to upload files. Invalid response from server.');
    } catch (error) {
      console.error('Upload multiple files error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload files. Please try again.',
      };
    }
  },

  // Upload business logo
  uploadBusinessLogo: async (file, businessId = null, onProgress = null) => {
    try {
      const uploadResponse = await uploadService.uploadFile(file, onProgress);
      
      if (!uploadResponse.success) {
        return uploadResponse;
      }

      // If businessId is provided, update the business profile with the new logo
      if (businessId) {
        const updateResponse = await authService.updateBusiness(businessId, {
          business_logo_url: uploadResponse.url,
        });

        if (!updateResponse.success) {
          return {
            success: false,
            error: 'File uploaded but failed to update business profile.',
          };
        }
      }

      return {
        success: true,
        message: 'Business logo uploaded successfully.',
        url: uploadResponse.url,
        file: uploadResponse.file,
      };
    } catch (error) {
      console.error('Upload business logo error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload business logo. Please try again.',
      };
    }
  },

  // Upload business cover image
  uploadBusinessCover: async (file, businessId = null, onProgress = null) => {
    try {
      const uploadResponse = await uploadService.uploadFile(file, onProgress);
      
      if (!uploadResponse.success) {
        return uploadResponse;
      }

      // If businessId is provided, update the business profile with the new cover
      if (businessId) {
        const updateResponse = await authService.updateBusiness(businessId, {
          business_cover_url: uploadResponse.url,
        });

        if (!updateResponse.success) {
          return {
            success: false,
            error: 'File uploaded but failed to update business profile.',
          };
        }
      }

      return {
        success: true,
        message: 'Business cover uploaded successfully.',
        url: uploadResponse.url,
        file: uploadResponse.file,
      };
    } catch (error) {
      console.error('Upload business cover error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload business cover. Please try again.',
      };
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file, onProgress = null) => {
    try {
      const uploadResponse = await uploadService.uploadFile(file, onProgress);
      
      if (!uploadResponse.success) {
        return uploadResponse;
      }

      return {
        success: true,
        message: 'Profile picture uploaded successfully.',
        url: uploadResponse.url,
        file: uploadResponse.file,
      };
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload profile picture. Please try again.',
      };
    }
  },

  // Validate file before upload
  validateFile: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
      toast.error(errors[0]);
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension not supported. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get file preview URL
  getFilePreview: (file) => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        reject(new Error('File type not supported for preview'));
      }
    });
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Delete uploaded file (if the API supports it)
  deleteFile: async (fileUrl) => {
    try {
      // This would depend on your API implementation
      // Most cloud storage services handle file deletion through their own APIs
      console.warn('File deletion not implemented. Handle through your storage service.');
      
      return {
        success: true,
        message: 'File deletion not implemented in this service.',
      };
    } catch (error) {
      console.error('Delete file error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file.',
      };
    }
  },
};

export default uploadService;
