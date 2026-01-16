import { ErrorResponse } from '../../../models/common/error-response.model';

export interface ResponseInterceptorConfig {
  onSuccess?: (response: Response) => Response | Promise<Response>;
  onError?: (error: any) => any | Promise<any>;
}

// Direct logout function - no service needed in React
const handleLogout = () => {
  // Clear all auth-related storage
  const itemsToRemove = ['session_token', 'user', 'authToken'];
  itemsToRemove.forEach(item => {
    localStorage.removeItem(item);
  });
  
  // Get CAM URL and redirect
  const camUrl = getCamUrl();
  const loginUrl = camUrl + "/login";
  
  // Force redirect
  window.location.href = loginUrl;
};

const getCamUrl = (): string => {
  // Use CAM URL from the global window.env_vars configuration
  if (window.env_vars && window.env_vars.camUrl) {
    return window.env_vars.camUrl;
  }
  
  // If no configuration found, throw error to alert developer
  throw new Error('CAM URL not found in window.env_vars configuration. Please check your env.js file.');
};

export const responseInterceptor = (): ResponseInterceptorConfig => {
  return {
    onError: async (error: any) => {
      let errorResponse: ErrorResponse;
      
      // Handle fetch response errors - try to parse the error body
      try {
        if (error.message && error.message.includes('API request failed')) {
          // This is a fetch error, try to get the response body
          const errorText = await error.response?.text?.() || '{}';
          errorResponse = JSON.parse(errorText) as ErrorResponse;
        } else if (error.error) {
          errorResponse = error.error as ErrorResponse;
        } else if (typeof error === 'string') {
          errorResponse = JSON.parse(error) as ErrorResponse;
        } else if (error && typeof error === 'object') {
          errorResponse = error as ErrorResponse;
        } else {
          errorResponse = error as ErrorResponse;
        }
      } catch (parseError) {
        errorResponse = error as ErrorResponse;
      }
      
      // if (
      //   errorResponse?.status === "ERROR" && 
      //   (errorResponse.message === "token_expired" || 
      //    errorResponse.message === "token_not_exists" || 
      //    errorResponse.message === 'invalid_user' || 
      //    errorResponse.message === 'token_invalid')
      // ) {
      //   handleLogout();
      // }
      
      return Promise.reject(error);
    },
  };
};
