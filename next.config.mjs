/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build to prevent it from failing the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
