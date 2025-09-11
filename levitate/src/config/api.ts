// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const API_ENDPOINTS = {
  
  // Auth endpoints
   LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  GET_ME: `${API_BASE_URL}/api/auth/me`,

  // Dataset endpoints
  DATASETS: `${API_BASE_URL}/api/datasets`,
  
  // Upload endpoints
  UPLOAD: `${API_BASE_URL}/api/upload`,
  
  // Database connection endpoints
  DB_CONNECT: `${API_BASE_URL}/api/db`,
  GENERATE_INSIGHTS: `${API_BASE_URL}/api/ai/generate-insights`,
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper function to make API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response;
}; 