/** @type {import('next').NextConfig} */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  // THIS IS THE DEFINITIVE FIX for the build errors.
  // It tells Next.js to re-process these libraries, solving the import issue.
  transpilePackages: ['@react-three/drei', 'three'],
};

module.exports = withPWA(nextConfig);