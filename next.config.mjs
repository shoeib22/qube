/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This allows Next.js to trust your internal folders like /logo or /api
    localPatterns: [
      {
        pathname: '/logo/**',
      },
      {
        pathname: '/api/products/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
