import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface ApiHook<T> extends ApiState<T> {
  execute: (config?: AxiosRequestConfig) => Promise<AxiosResponse<any, any> | null>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with automatic retry capability
 * @param url The API endpoint URL
 * @param method The HTTP method (GET, POST, PUT, DELETE)
 * @param initialData Initial data state
 * @param retries Number of retries for failed requests
 * @param retryDelay Delay between retries in milliseconds
 */
export function useApi<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  initialData: T | null = null,
  retries = 2,
  retryDelay = 1000
): ApiHook<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    });
  }, [initialData]);

  const execute = useCallback(
    async (config?: AxiosRequestConfig): Promise<AxiosResponse | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const token = localStorage.getItem('token');
      
      let attempts = 0;
      
      while (attempts <= retries) {
        try {
          const axiosConfig: AxiosRequestConfig = {
            url,
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
              ...config?.headers,
            },
            ...config,
            timeout: config?.timeout || 10000, // 10 second default timeout
          };

          console.log(`API Call (Attempt ${attempts + 1}/${retries + 1}):`, {
            url,
            method,
            ...axiosConfig,
          });

          const response = await axios(axiosConfig);
          
          if (response.data && response.data.success === false) {
            throw new Error(response.data.message || 'API returned failure status');
          }

          setState({
            data: response.data?.data || response.data,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error: any) {
          attempts++;
          console.error(`API error (Attempt ${attempts}/${retries + 1}):`, error);
          
          if (attempts <= retries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          } else {
            // Final error after all retries
            let errorMessage = 'Unknown error occurred';
            
            if (error.response) {
              // Server responded with error status
              errorMessage = error.response.data?.message || 
                `Server error: ${error.response.status}`;
              console.error('Error response:', error.response);
            } else if (error.request) {
              // Request made but no response
              errorMessage = 'No response from server. Please check your connection.';
              console.error('Error request:', error.request);
            } else {
              // Error in request setup
              errorMessage = error.message;
            }
            
            setState({
              data: null,
              isLoading: false,
              error: new Error(errorMessage),
            });
            
            throw error;
          }
        }
      }
      
      return null;
    },
    [url, method, retries, retryDelay]
  );

  return { ...state, execute, reset };
}

export default useApi; 