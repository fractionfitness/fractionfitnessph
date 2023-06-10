/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    // add deps herer that server components use
    serverComponentsExternalPackages: ['bcrypt', '@prisma/client'],
  },
};

module.exports = nextConfig;
