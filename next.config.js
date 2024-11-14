/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const isProduction = process.env.IS_PRODUCTION_BACKEND === 'true';
    const baseUrl = isProduction 
      ? process.env.BACKEND_BASE_URL || 'https://basedatastorev2-production.up.railway.app/'
      : process.env.BACKEND_BASE_URL_DEV || 'http://localhost:8001/';
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*` || "https://basedatastorev2-production.up.railway.app'}/api/:path*",
      },
      {
        source: '/login',
        destination: '/pages/login',
      },
      {
        source: '/register',
        destination: '/pages/register',
      }
    ];
  },
  env: {
    CSRF_SECRET: process.env.CSRF_SECRET,
  },
};

module.exports = nextConfig;