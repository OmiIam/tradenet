/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove API rewrites - frontend should call Railway backend directly
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:5001/api/:path*',
  //     },
  //   ]
  // },
}

module.exports = nextConfig