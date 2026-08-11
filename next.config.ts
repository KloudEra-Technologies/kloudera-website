import type { NextConfig } from "next";

const securityHeaders = [
  // 1. HSTS - Forces HTTPS, prevents SSL stripping attacks
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // 2. CSP - Prevents XSS and unauthorized script injection
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob:",
      "connect-src 'self' https://api.resend.com https://www.google-analytics.com https://accounts.google.com https://vitals.vercel-insights.com",
      "frame-src 'self' https://accounts.google.com https://calendar.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  // 3. Prevent clickjacking - blocks malicious iframe embedding
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // 4. Prevent MIME-sniffing attacks
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 5. Enable XSS filtering in older browsers
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // 6. Control referrer information leakage
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 7. Restrict browser features (camera, mic, etc.)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
