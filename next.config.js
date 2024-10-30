/** @type {import('next').NextConfig} */

module.exports = async () => {
  const nextConfig = {
    env: {
      NEXT_PUBLIC_MONGODB_URI: process.env._NEXT_PUBLIC_MONGODB_URI,
    },
    redirects: async () => [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ],
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
  };

  return nextConfig;
};
