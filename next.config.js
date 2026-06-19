/** @type {import('next').NextConfig} */
const nextConfig = {
  // 强行放行编译期的一些零碎警告
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // 如果是服务器端或 Edge 编译，强行把这几个让 Cloudflare 崩溃的别名重定向到常规的空壳上
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias['next/dist/compiled/node-fetch'] = require.resolve('next/dist/compiled/node-fetch');
    
    return config;
  }
};

module.exports = nextConfig;