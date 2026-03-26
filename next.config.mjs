/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.simpleicons.org', 'localhost', 'paddle-billing.vercel.app', 'images.unsplash.com'],
  },
  // Hide Next.js dev overlay widgets (like the "2 Issues" indicator).
  devIndicators: false,
};

export default nextConfig;
