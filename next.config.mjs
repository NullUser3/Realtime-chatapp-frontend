/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // add Google avatar domain
  },
rewrites: async () => [
  {
    source: "/api/:path*",
    destination: "https://realtime-chatapp-backend-rfsk.onrender.com/:path*",
  },
  {
    source: "/socket.io/:path*",
    destination: "https://realtime-chatapp-backend-rfsk.onrender.com/socket.io/:path*",
  },
]
};

export default nextConfig;
