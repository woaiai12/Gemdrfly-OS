/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 禁用静态生成，使用完全动态渲染
  output: 'standalone',
  // 避免静态生成时的认证问题
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
