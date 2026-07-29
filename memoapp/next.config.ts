import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/waitlist",
        destination: "http://www.joinmettavia.online/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;