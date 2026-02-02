/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        // This pattern allows images from your specific Firebase bucket
        pathname: '/cube-8c773.firebasestorage.app/**',
      },
    ],
  },
};

export default nextConfig;