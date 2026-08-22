/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/v/:token',
        destination: '/client-review.html',
      },
      {
        source: '/approve/:token',
        destination: '/client-review.html',
      },
    ];
  },
};

export default nextConfig;
