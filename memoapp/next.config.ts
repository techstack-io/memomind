import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Match everything EXCEPT /waitlist (and subpaths of waitlist)
        source: "/((?!waitlist).*)",
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
        source: "/((?!waitlist).*)",
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