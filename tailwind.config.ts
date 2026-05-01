import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        scarlet: { DEFAULT: '#ef4444', soft: 'rgba(239,68,68,0.15)' },
        amber: '#eab308',
        green: '#22c55e',
        blue: '#3b82f6',
        violet: '#a855f7',
        slate: '#64748b',
        'bg-card': '#111118',
        'bg-elev': '#1a1a23',
      },
    },
  },
}

export default config
