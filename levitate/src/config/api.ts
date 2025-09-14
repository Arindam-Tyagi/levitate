// levitate/src/config/api.ts

// Use a relative path to engage the Vite proxy
export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  GET_ME: `${API_BASE_URL}/auth/me`,

  // Dataset endpoints
  DATASETS: `${API_BASE_URL}/datasets`,

  // Upload endpoints
  UPLOAD: `${API_BASE_URL}/upload`,

  // Database connection endpoints
  // Note: The backend route is '/api/connect/db', not '/api/db'
  DB_CONNECT: `${API_BASE_URL}/connect/db`,
  GENERATE_INSIGHTS: `${API_BASE_URL}/ai/generate-insights`,
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper function to make API requests (no changes needed here)
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // The endpoint is already a full path like '/api/auth/login'
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Create a custom error object to pass the response body
    const error: any = new Error(`API request failed: ${response.status} ${response.statusText}`);
    try {
        error.body = await response.json();
    } catch (e) {
        error.body = { message: 'An unknown error occurred.' };
    }
    throw error;
  }

  return response;
};