import { cookies } from 'next/headers';

import config from '@/config';

const DJANGO_API_URL = config.backendApiUrl;
const POSTGRESS_URL = config.databaseUrl;


export default async function datastoreApi(endpoint, options = {}) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token.value}` }),
    ...options.headers
  };

  try {
    console.log("postgres API:", POSTGRESS_URL)
    console.log("DJANGO API:", DJANGO_API_URL)
    console.log("DJANGO API:", `${DJANGO_API_URL}${endpoint}`)
    const response = await fetch(`${DJANGO_API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Set or update token if it's in the response
    if (data.token) {
      cookies().set('token', data.token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production'
      });
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;  
  }
}