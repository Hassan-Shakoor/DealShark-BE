import { useState, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
};

// Hook for async operations with success/error states
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (operation) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await operation();
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    execute,
    reset,
  };
};

// Hook for form submissions
export const useFormSubmit = (submitFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await submitFn(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || 'Submission failed');
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submitFn]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    submit,
    reset,
  };
};

// Hook for file uploads with progress
export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const upload = useCallback(async (uploadFn, files) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setUploadedFiles([]);
    
    try {
      const result = await uploadFn(files, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });
      
      setSuccess(true);
      setUploadedFiles(result.files || [result]);
      return result;
    } catch (err) {
      setError(err.message || 'Upload failed');
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setProgress(0);
    setUploadedFiles([]);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    success,
    progress,
    uploadedFiles,
    upload,
    reset,
  };
};

export default useApi;
