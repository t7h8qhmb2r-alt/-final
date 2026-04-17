/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: 'imgfp.hotp.jp' }] } };
module.exports = nextConfig;
