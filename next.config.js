/** @type {import('next').NextConfig} */

module.exports = async () => {
  const nextConfig = {
    env: {
      NEXT_PUBLIC_MONGODB_URI: process.env._NEXT_PUBLIC_MONGODB_URI,
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env._NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env._NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_LOCATIONIQ_API_KEY: process.env._NEXT_PUBLIC_LOCATIONIQ_API_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env._NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    redirects: async () => [
      {
        source: "/",
        destination: "/store",
        permanent: false,
      },
    ],
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "**",
        },
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
  };

  return nextConfig;
};
