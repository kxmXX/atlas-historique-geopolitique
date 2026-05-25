import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: { typedRoutes: true },
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
