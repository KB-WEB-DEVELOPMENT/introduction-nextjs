import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
 
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,  // actually already included in pageExtensions
})

export default withMDX(nextConfig)