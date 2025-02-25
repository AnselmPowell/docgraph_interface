const isProductionFrontend = process.env.IS_PRODUCTION_FRONTEND === 'true';
const isProductionBackend = process.env.IS_PRODUCTION_BACKEND === 'true';
  
const config = {
  isProductionFrontend,
  isProductionBackend,
  backendBaseUrl: isProductionBackend 
    ? process.env.BACKEND_BASE_URL
    : process.env.BACKEND_BASE_URL_DEV,
  backendApiUrl: isProductionBackend 
    ? process.env.BACKEND_API_URL
    : process.env.BACKEND_API_URL_DEV,
  redirectUrl: isProductionFrontend 
    ? process.env.FRONTEND_BASE_URL
    : process.env.FRONTEND_BASE_URL_DEV,
  databaseUrl: isProductionBackend
    ? process.env.POSTGRES_URL
    : process.env.POSTGRES_URL_DEV,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecretId: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: isProductionFrontend
    ? process.env.GOOGLE_CALLBACK_URL
    : process.env.GOOGLE_CALLBACK_URL_DEV,
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
  microsoftRedirectUri: isProductionFrontend
    ? process.env.MICROSOFT_CALLBACK_URL
    : process.env.MICROSOFT_CALLBACK_URL_DEV,
    
};

module.exports = config;