/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://cleancomfort-chiba-uploads.s3.amazonaws.com https://cleancomfort-chiba-uploads.s3.ap-northeast-1.amazonaws.com https://www.google-analytics.com https://www.googletagmanager.com;
              font-src 'self' data:;
              connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com;
              frame-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `
              .replace(/\s+/g, " ")
              .trim(),
          },
        ],
      },
    ]
  },
  images: {
    domains: [
      "cleancomfort-chiba-uploads.s3.amazonaws.com",
      "cleancomfort-chiba-uploads.s3.ap-northeast-1.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cleancomfort-chiba-uploads.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cleancomfort-chiba-uploads.s3.ap-northeast-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
