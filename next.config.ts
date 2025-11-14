import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {

       '/api/**/*': ['./node_modules/.prisma/client/**/*'],

       '/*': ['./node_modules/.prisma/client/**/*'],

   },
  /* config options here */
};

export default nextConfig;
