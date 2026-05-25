import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: { typedRoutes: true },

  // Cache long-term pour les assets statiques geo (immutables)
  async headers() {
    return [
      {
        source: '/data/geo/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }
        ]
      },
      {
        source: '/data/themes/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }
        ]
      }
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'maplibre-gl$': path.resolve(
          __dirname,
          'node_modules/maplibre-gl/dist/maplibre-gl.js'
        )
      }
    }
    return config
  }
}

export default nextConfig
