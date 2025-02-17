// hooks/useAuth.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../../lib/api';
import { getCsrfToken } from '../../lib/auth';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Initialize user from localStorage on client-side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            console.log("Saved User: ", JSON.parse(savedUser))
            if (savedUser) {
                try {
                    updateUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error('Error parsing saved user:', e);
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        }
    }, []);

    


   const updateUser = useCallback((newUser) => {
        console.log("Updating user state:", newUser);
        setUser(newUser);
        if (typeof window !== 'undefined') {
            if (newUser) {
                document.documentElement.classList.add('user');
                // Dispatch custom event
                window.dispatchEvent(new CustomEvent('userStateChanged', {
                    detail: { user: newUser }
                }));

                localStorage.setItem('user', JSON.stringify(newUser));
                
            
            } else {
                document.documentElement.classList.remove('user');
                window.dispatchEvent(new CustomEvent('userStateChanged', {
                    detail: { user: null }
                }));
                
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = useCallback(async ({ email, password }) => {
        console.log("Login - Starting");
        setLoading(true);
        setError(null); 
        try {
            const data = await fetchApi('auth/login/', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            console.log("Login - Success:", data.user);
            updateUser(data.user);

            if (data.access_token && typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token);
                }
            }
            return data;
        } catch (error) {
            console.error("Login - Error:", error);
            // Handle specific "User not found" errors from backend
        if (error.message.includes("User not found") || error.message.includes("No user exists")) {
            setError("No account found with this email/password. Please check your credentials or sign up.");
        } else {
            setError(error.message);
        }
        
            throw error;
        } finally {
            setLoading(false);
            console.log("Login - Completed");
        }
    }, [updateUser]);

    const register = useCallback(async ({ email, password, first_name, last_name, confirm_password }) => {
        console.log("sign up: ", email )
        setLoading(true);
        // try {
            const csrfToken = await getCsrfToken();
            const data = await fetchApi('auth/register/', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    confirm_password,
                    first_name,
                    last_name,
                    csrfToken
                })
            });

            console.log("Registration response:", data);
           

            // Store tokens if they're in the response
            if (data.access_token && typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token);
                }
            }
            updateUser(data.user);
            setLoading(false);

            return data;
        // } catch (error) {
        //     console.error('Registration error:', error);
        //     setError(error.message);
        //     throw error;
        // } finally {
            setLoading(false);
        // }
    }, [updateUser]);

    const logout = useCallback(async () => {
        console.log("[useAuth] Starting logout");
        setLoading(true);
        try {
            // Get token for logging
            const token = localStorage.getItem('accessToken');
            console.log("[useAuth] Found token:", !!token);
    
            await fetchApi('auth/logout/', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            
    
            // Clear all auth data
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
    
            // Update state
            updateUser(null);
            console.log("[useAuth] Logout successful");
    
        } catch (error) {
            console.error("[useAuth] Logout error:", error);
            // Still clear data even if backend logout fails
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
            updateUser(null);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [updateUser]);

    const checkAuth = useCallback(async () => {
        if (!user && typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
            setLoading(true);
            try {
                console.log("[useAuth] Checking authentication");
                const response = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                  },
                  });
                const data = await response.json();
                
                console.log("[useAuth] Auth check response:", data);
                
                if (data.status === 'success') {
                    updateUser(data.user);
                    console.log("[useAuth] User updated:", data.user);
                } else {
                    throw new Error('Auth check failed');
                }
                
            } catch (error) {
                console.error('[useAuth] Auth check error:', error);
                updateUser(null);
                // Clear invalid tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } finally {
                setLoading(false);
            }
        }
    }, [user, updateUser]);

    const googleLogin = async (code) => {
    
        try {
          const response = await fetch(`/api/auth/google/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include'
          });
          
          const data = await response.json();
          setUser(data.user);
          return data.user
    
        } catch (error) {
          console.error('Google login error', error);
          throw error;
        }
      };
    
    
      const microsoftLogin = async () => {
        try {
          const response = await fetch('/api/auth/microsoft/url');
          const { url } = await response.json();
          window.location.href = url;
        } catch (error) {
          console.error('Microsoft login error', error);
          throw error;
        }
      };

    // Setup token refresh interval
    useEffect(() => {
        // if (user && typeof window !== 'undefined') {
        //     const refreshToken = localStorage.getItem('refreshToken');
        //     if (!refreshToken) return;

        //     const refreshInterval = setInterval(async () => {
        //         try {
        //             const response = await fetchApi('auth/token/refresh/', {
        //                 method: 'POST',
        //                 body: JSON.stringify({ refresh_token: refreshToken })
        //             });

        //             if (response.access_token) {
        //                 localStorage.setItem('accessToken', response.access_token);
        //                 if (response.refresh_token) {
        //                     localStorage.setItem('refreshToken', response.refresh_token);
        //                 }
        //             }
        //         } catch (error) {
        //             console.error('Token refresh error:', error);
        //             // If refresh fails, log out the user
        //             await logout();
        //         }
        //     }, 14 * 60 * 1000); // Refresh every 14 minutes

        //     return () => clearInterval(refreshInterval);
        // }
    }, [user, logout]);

    // Initial auth check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        user,
        setUser,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
        googleLogin,
        microsoftLogin
    };
}



