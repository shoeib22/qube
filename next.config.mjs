/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root: a stray lockfile in the parent dir otherwise makes
  // Turbopack infer C:\Users\Shoeii as root, which broke CSS recompilation.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    localPatterns: [
      { pathname: '/logo/**' },
      { pathname: '/api/products/**' },
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
}

export default nextConfig