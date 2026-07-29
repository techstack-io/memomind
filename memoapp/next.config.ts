import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "joinmettavia.online",
          },
        ],
        destination: "/waitlist",
        permanent: false,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.joinmettavia.online",
          },
        ],
        destination: "/waitlist",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;