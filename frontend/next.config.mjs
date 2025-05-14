/** @type {import('next').NextConfig} */

const nextConfig = {
  env:{
    server:"https://api.debugchiai.com",
    ws:"http://127.0.0.1:8001",
    dashboard:'/user/dashboard',
    nodejs_server:"https://195.248.242.157",
    MONGODB_URI:"mongodb://localhost:27017/"
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        
      },
      {
        protocol:"https",
        hostname:"images.unsplash.com"
      },
      {
        protocol:"https",
        hostname:"i.pravatar.cc"
      }
    ],
  },
};

export default nextConfig;
