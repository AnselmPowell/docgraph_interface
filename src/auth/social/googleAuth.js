import config from '@/config';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  config.googleClientId,
  config.googleSecretId,
  config.googleRedirectUri
);

export function getGoogleAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
  });
}

export async function getGoogleUser(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const userinfo = await oauth2Client.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
  });

  return userinfo.data;
}