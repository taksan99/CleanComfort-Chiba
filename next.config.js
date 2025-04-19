/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      process.env.S3_BUCKET_NAME + ".s3." + process.env.AWS_REGION + ".amazonaws.com",
      "cleancomfort-chiba-uploads.s3.ap-northeast-1.amazonaws.com",
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1週間のキャッシュ
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // 画像の最適化を無効化
  },
  experimental: {
    // optimizeCss: true, // この行を削除または無効化
    optimizeServerReact: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintエラーを無視
  },
  typescript: {
    ignoreBuildErrors: true, // ビルド時のTypeScriptエラーを無視
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.doubleclick.net https://googleads.g.doubleclick.net https://*.google.com https://*.google.co.jp; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https://www.google-analytics.com https://*.amazonaws.com https://*.google.com https://*.google.co.jp https://*.doubleclick.net https://www.googleadservices.com; " +
              "connect-src 'self' https://www.google-analytics.com https://*.doubleclick.net https://*.google.com https://*.google.co.jp https://googleads.g.doubleclick.net; " +
              "frame-src 'self' https://*.doubleclick.net https://www.googletagmanager.com https://*.google.com https://*.google.co.jp;",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/favicon.ico",
        destination: "/api/favicon",
      },
    ]
  },
}

module.exports = nextConfig
