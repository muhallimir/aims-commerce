/** @type {import('next').NextConfig} */

module.exports = async () => {
  const nextConfig = {
    env: {
      NEXT_PUBLIC_MONGODB_URI: process.env._NEXT_PUBLIC_MONGODB_URI,
    },
    redirects: async () => {
      return [
        {
          source: "/",
          destination: "/home",
          permanent: true,
        },
      ];
    },
  };

  return nextConfig;
};
