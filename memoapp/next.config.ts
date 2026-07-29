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
        // DO NOT redirect if the user is already requesting /waitlist
        missing: [
          {
            type: "header",
            key: "x-invoke-path", // or handle via source regex below
          }
        ],
        destination: "/waitlist",
        permanent: false,
      },
    ];
  },
};