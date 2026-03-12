import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 避免静态生成时的认证问题
  images: {
    unoptimized: true,
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
