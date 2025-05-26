/** @type {import('next').NextConfig} */
const nextConfig = {
  // See https://lucide.dev/guide/packages/lucide-react#nextjs-example
  transpilePackages: ["lucide-react"],
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false // disable source maps
    }
    return config
  },
}

export default nextConfig
