// // src/lib/api.js


import config from "../config"
import {getAuthTokens} from "./auth"

const backendApiUrl = config.backendApiUrl


export const fetchApi = async (endpoint, options = {}) => {
    try {
     // Get auth token from localStorage
     const accessToken = localStorage.getItem('accessToken');
        
     // Set up headers with token if available
     const headers = {
         'Content-Type': 'application/json',
         ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
         ...options.headers
     };

     console.log(`[fetchApi] Sending request to ${endpoint}`, { 
         headers, 
         method: options.method 
     });

        console.log("Config path endpoint: ", backendApiUrl )
        console.log("fetch--- endpoint :", `http://localhost:8001/api/${endpoint}`)
        const response = await fetch(`http://localhost:8001/api/${endpoint}`, {
            ...options,
                headers,
                credentials: 'include'
            });

            // For 204 No Content response (like logout)
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'No Account Found');
            }

            if (response.status === 401) {
                const error = await response.json();
                throw new Error(error.message || 'Invalid Password Please Try Again');
            }

            if (response.status === 404) {
                const error = await response.json();
                throw new Error(error.message || 'No account found');
            }

            if (response.status === 429) {
                const error = await response.json();
                throw new Error(error.message || 'Too Many Attempts Try Again Later');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Request failed');
            }

            // For 204 No Content response (like logout)
            if (response.status === 204) {
                return null;
            }

        return response.json();
    } catch (error) {
        console.error(`[fetchApi] Error in ${endpoint}:`, error);
        throw error;
    }
}


