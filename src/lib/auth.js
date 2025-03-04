// src/lib/auth.js
// Auth utility functions

export async function getCsrfToken() {
  try {
      const response = await fetch('/api/auth/csrf');
      const data = await response.json();
      return data.csrfToken; // May be null, that's OK for new sessions
  } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return null;
  }
}

export const setAuthTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const getAuthTokens = () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
});

export const clearAuthTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};