/** @type {import('next').NextConfig} */
export default {
  output: 'export', // Enable static export mode
  reactStrictMode: true, // Enable React strict mode 
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
};
