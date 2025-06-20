/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  swcMinify: false,
  // reactStrictMode: true,
  env: {
    VERSAO: 'v1.0.17',
  },
};

module.exports = nextConfig;
