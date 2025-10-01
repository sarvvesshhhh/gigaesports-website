/** @type {import('next').NextConfig} */
const nextConfig = {
  // V-- ADD THIS 'images' CONFIGURATION --V
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pandascore.co',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;