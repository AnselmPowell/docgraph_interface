// import config from '../../config'
// import { OAuth2Client } from 'google-auth-library';

// // const oauth2Client = new OAuth2Client(
// //   config.googleClientId,
// //   config.googleSecretId,
// //   config.googleRedirectUri
// // );


// const oauth2Client = new OAuth2Client({
//   clientId: config.googleClientId,
//   clientSecret: config.googleSecretId,
//   redirectUri: config.googleRedirectUri,
//   timeout: 10000, // Add timeout of 10 seconds
//   retry: true,    // Enable retries
//   retryConfig: {
//     retry: 3,
//     retryDelay: 100,
//     statusCodesToRetry: [[100, 199], [429, 429], [500, 599]]
//   }
// });

// export function getGoogleAuthUrl() {
//   const scopes = [
//     'https://www.googleapis.com/auth/userinfo.email',
//     'https://www.googleapis.com/auth/userinfo.profile',
//   ];

//   return oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes,
//     include_granted_scopes: true,
//     prompt: 'consent',
//   });
// }

// export async function getGoogleUser(code) {

//   console.log(" GET Google Code: ", code )
//   const { tokens } = await oauth2Client.getToken(code);
//   console.log(" GET Google User: ", tokens)
//   oauth2Client.setCredentials(tokens);

//   const userinfo = await oauth2Client.request({
//     url: 'https://www.googleapis.com/oauth2/v3/userinfo',
//   });

//   return userinfo.data;
// }



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
  console.log("[googleAuth] Exchanging code for tokens");

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
      throw new Error('Failed to exchange code for tokens');
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
