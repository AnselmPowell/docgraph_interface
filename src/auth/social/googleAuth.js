// src/auth/social/googleAuth.js
import config from '../../config'

export function getGoogleAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: config.googleRedirectUri,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getGoogleUser(code) {
  console.log("[googleAuth] Exchanging code for tokens: ", code);
  console.log('[googleAuth] Config check:', {
    clientIdLength: config.googleClientId?.length || 0,
    clientSecretLength: config.googleSecretId?.length || 0,
    redirectUri: config.googleRedirectUri
  });

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.googleClientId,
        client_secret: config.googleSecretId,
        redirect_uri: config.googleRedirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error('[googleAuth] Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        body: errorBody
      });
      throw new Error(`Failed to exchange code for tokens: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorBody}`);
    }

    const tokens = await tokenResponse.json();
    console.log("[googleAuth] Token exchange successful");

    // Get user info using access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();
    console.log("[googleAuth] User info retrieved successfully");

    return {
      email: userData.email,
      name: userData.name,
      given_name: userData.given_name,
      family_name: userData.family_name,
      picture: userData.picture
    };

  } catch (error) {
    console.error('[googleAuth] Error:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    throw error;
  }
}
