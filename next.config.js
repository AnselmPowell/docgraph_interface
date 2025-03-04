
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configure headers for CORS
  async headers() {
    return [
      {
        // Headers for PDF proxy
        source: '/api/file/pdf/proxy',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
        ],
      },
    ];
  },

  // API and page rewrites
  async rewrites() {
    const isProduction = process.env.IS_PRODUCTION_BACKEND === 'true';
    const baseUrl = isProduction
  ? process.env.BACKEND_BASE_URL || 'https://docgraphapi.up.railway.app'
  : process.env.BACKEND_BASE_URL_DEV || 'http://localhost:8001';
    return [
      // PDF proxy route - handle locally
      {
        source: '/api/file/pdf/proxy',
        destination: '/api/file/pdf/proxy'
      },
      // Handle all other API routes
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`
      },
      // Page routes
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

  // WebPack configuration for PDF.js
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },

  // Image domains configuration
  images: {
    domains: [
      'teal-ready-mouse-587.mypinata.cloud',
      'localhost',
      'docgraphapi.up.railway.app'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mypinata.cloud',
        port: '',
        pathname: '/files/**',
      },
    ],
  },

  // Environment variables
  env: {
    CSRF_SECRET: process.env.CSRF_SECRET,
  },

  // Experimental features
  experimental: {
    // Enable if needed
    // esmExternals: true,
    // serverComponents: true,
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: false,
  },

  // Enable strict mode for better error catching
  typescript: {
    ignoreBuildErrors: false,
  },

  // Output configuration
  output: 'standalone',

  trailingSlash: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Configure compression
  compress: true,

  // Configure asset prefix if needed
  // assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,

  // Configure base path if needed
  basePath: process.env.NODE_ENV === 'production' ? '' : '',

  // Disable image optimization if using external service
  // images: { unoptimized: true },
};

module.exports = nextConfig;