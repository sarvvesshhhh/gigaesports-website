// Add this check at the very top
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error("Build failed: NEXTAUTH_SECRET environment variable is missing!");
}


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pandascore.co',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      // V-- ADD THIS NEW OBJECT FOR GOOGLE --V
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;