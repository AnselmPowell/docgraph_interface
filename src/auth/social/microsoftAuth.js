import config from '../../config'
import { PublicClientApplication, CryptoProvider } from '@azure/msal-node';

const msalConfig = {
    auth: {
        clientId: config.microsoftClientId,
        authority: 'https://login.microsoftonline.com/consumers',
    },
};

export const msalInstance = new PublicClientApplication(msalConfig);


export async function getMicrosoftAuthUrl() {
  console.log("Inside Microsoft")
  const cryptoProvider = new CryptoProvider();
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

  const scopes = ['user.read', 'openid', 'profile', 'email'];
  const redirectUri = config.microsoftRedirectUri;
  console.log("Inside Microsoft redirect url: ", redirectUri)
  if (!redirectUri) {
    throw new Error('Redirect URI is not set in environment variables');
  }

  try {
    const authCodeUrlParameters = {
      scopes: scopes,
      redirectUri: redirectUri,
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
    };

    const response = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);
    
    console.log("Inside Microsoft response url: ", response)
    console.log("Inside Microsoft response verifier: ", verifier)
    return { url: response, codeVerifier: verifier };
  } catch (error) {
    console.error("Error generating auth URL:", error);
    throw error;
  }
}

// export async function getMicrosoftAuthUrl() {
//   console.log("Initiating Microsoft auth URL generation");
  
//   try {
//       // Generate PKCE codes
//       const cryptoProvider = new CryptoProvider();
//       const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

//       const scopes = ['user.read', 'openid', 'profile', 'email', 'offline_access'];
//       const redirectUri = config.microsoftRedirectUri;

//       // Build auth URL manually
//       const params = new URLSearchParams({
//           client_id: config.microsoftClientId,
//           response_type: 'code',
//           redirect_uri: redirectUri,
//           scope: scopes.join(' '),
//           response_mode: 'query',
//           code_challenge: challenge,
//           code_challenge_method: 'S256',
//           prompt: 'select_account'
//       });

//       const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${params.toString()}`;
      
//       console.log("Microsoft Auth - Initialization successful", {
//           redirectUri,
//           scopes: scopes.join(' '),
//           verifierLength: verifier.length,
//           challengeLength: challenge.length
//       });

//       return { 
//           url: authUrl, 
//           codeVerifier: verifier 
//       };

//   } catch (error) {
//       console.error("Microsoft Auth - URL generation error:", error);
//       throw error;
//   }
// }