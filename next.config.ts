/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Necesario si usas imágenes de Next.js
  },
};

module.exports = nextConfig;
