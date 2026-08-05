/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for the Docker image (see Dockerfile) — bundles only the
  // production node_modules subset a `next start` server actually needs.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Self-hosted Supabase Storage, fronted by Caddy — see docker-compose.yml /
        // the VPS Caddyfile. Update if the Supabase subdomain changes.
        hostname: 'supabase.xerovolt.in',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;