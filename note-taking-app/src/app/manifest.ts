import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Notes App',
    short_name: 'Notes App',
    description: 'Your personal note-taking workspace',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0046FF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

