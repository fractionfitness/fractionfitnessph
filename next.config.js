/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    // add deps herer that server components use
    serverComponentsExternalPackages: ['bcrypt', '@prisma/client'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
