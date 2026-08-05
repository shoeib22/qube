/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for the Docker image (see Dockerfile) — bundles only the
  // production node_modules subset a `next start` server actually needs.
  output: 'standalone',
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
      {
        protocol: 'https',
        hostname: 'xdpjcjphexpqojqudrqc.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      {
        // Local Supabase Docker stack (supabase start) — dev only.
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
}

export default nextConfig