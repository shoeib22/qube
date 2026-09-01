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
    // The self-hosted Supabase instance is on the same Docker network as this app,
    // given a network alias (supabase.xerovolt.in -> Caddy's container) so server-side
    // API calls avoid hairpin NAT back through the host's own public IP. That alias
    // means the hostname resolves to a private IP from inside this container — which
    // next/image's built-in optimizer refuses to fetch from (SSRF protection), even
    // though the image itself loads fine. These product photos don't need Next's
    // resize/reencode pipeline anyway, so skip it rather than fight the two features
    // wanting contradictory DNS resolution for the same hostname.
    unoptimized: true,
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
        // Self-hosted Supabase on the VPS, fronted by Caddy.
        protocol: 'https',
        hostname: 'supabase.xerovolt.in',
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