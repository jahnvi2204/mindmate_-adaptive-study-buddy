/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    // Treat the pdf.js worker as a static asset so it isn't parsed/minified by Terser.
    config.module.rules.push({
      test: /pdf\.worker\.min\.(m)?js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/pdfjs/[name][ext]',
      },
    });
    return config;
  },
};

module.exports = nextConfig;

