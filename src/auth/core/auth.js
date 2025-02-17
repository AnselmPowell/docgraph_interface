// src/auth/core/auth.js
import { cookies } from 'next/headers';
import crypto from 'crypto';
import config from '../../config';

const CSRF_SECRET = process.env.CSRF_SECRET;

// Keep existing CSRF functions
export function generateCSRFToken() {
  const tokenValue = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  const token = `${tokenValue}|${timestamp}`;
  const hash = crypto.createHmac('sha256', CSRF_SECRET).update(token).digest('hex');
  return `${token}|${hash}`;
}

export function validateCSRFToken(token, storedToken) {
  if (!token || !storedToken) return false;
  const [tokenValue, timestamp, hash] = token.split('|');
  if (token !== storedToken) return false;
  const expectedHash = crypto.createHmac('sha256', CSRF_SECRET)
    .update(`${tokenValue}|${timestamp}`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}

export function setCSRFTokenCookie(token) {
  const cookieStore = cookies();
  cookieStore.set('csrfToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600,
    path: '/',
  });
}

// Handle Google authentication using existing login/register endpoint
export async function googleLoginRegister(email, name) {
  console.log('[Auth] Starting Google authentication');
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');
  
  
  console.log(`[Auth] ENDPOINT: , ${config.backendApiUrl}auth/csrf/}`);
  

    // Get CSRF token first
    const csrfResponse = await fetch(`${config.backendApiUrl}auth/csrf/`, {
      credentials: 'include'
    });
    const { csrfToken } = await csrfResponse.json();

    const password = crypto.randomBytes(16).toString('hex')

    // Use existing register endpoint
    const response = await fetch(`${config.backendApiUrl}auth/social/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        provider: 'google'
      })
    });
    console.log("Return Social Auth:", response )

    if (!response.ok) {
      // If registration fails, try login instead (user might already exist)
      const loginResponse = await fetch(`${config.backendApiUrl}auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        throw new Error('Authentication failed');
      }
      

      return loginResponse.json()
    }
    
    return response.json()

}

// Handle Microsoft authentication using existing login/register endpoint
export async function microsoftLoginRegister(email, name) {
  console.log('[Auth] Starting Microsoft authentication');
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');

  try {
    // Get CSRF token first
    const csrfResponse = await fetch(`${config.backendApiUrl}auth/csrf/`, {
      credentials: 'include'
    });
    const { csrfToken } = await csrfResponse.json();

    const password = crypto.randomBytes(16).toString('hex')

    // Use existing register endpoint
    const response = await fetch(`${config.backendApiUrl}auth/social/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        provider: 'microsoft'
      })
    });
    console.log("Return Social Auth:", response )

    if (!response.ok) {
      console.log("Return Login Auth")
      // If registration fails, try login instead (user might already exist)
      const loginResponse = await fetch(`${config.backendApiUrl}auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        throw new Error('Authentication failed');
      }
 
      return await loginResponse.json();
    }
  
    return await response.json();

  } catch (error) {
    console.error('[Auth] Microsoft authentication error:', error);
    throw error;
  }
}