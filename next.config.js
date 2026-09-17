/** @type {import('next').NextConfig} */

module.exports = async () => {
  const nextConfig = {
    trailingSlash: false,
    env: {
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_LOCATIONIQ_API_KEY: process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
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
    // pdfkit loads font/AFM data through dynamic requires the file tracer
    // cannot follow, so ship them explicitly for the invoice PDF route.
    outputFileTracingIncludes: {
      "/api/orders/[id]/invoice": [
        "./node_modules/pdfkit/js/standard-fonts/**/*",
        "./node_modules/pdfkit/js/data/**/*",
      ],
    },
  };

  return nextConfig;
};
