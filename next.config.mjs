/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  // Next.js 15 dev CORS 設定（将来のメジャーで必須）
  experimental: {
    allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
      ? process.env.ALLOWED_DEV_ORIGINS.split(",")
      : undefined,
  },
};

export default nextConfig;
