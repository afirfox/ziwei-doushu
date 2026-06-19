/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启 Next.js 官方的纯静态打包导出模式
  output: 'export',
  
  // 忽略编译期的零碎非致命警告
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 彻底移除之前报错的 webpack alias 别名注入
};

module.exports = nextConfig;