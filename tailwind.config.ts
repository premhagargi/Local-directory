import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
	darkMode: ['class'],
	content: ['./app/**/*.{ts,tsx, mdx}'],
	safelist: [
		...Array.from({ length: 11 }, (_, i) => `w-${i + 1}/12`),
		...Array.from({ length: 11 }, (_, i) => `pl-${i + 1}`),
		...Array.from({ length: 11 }, (_, i) => `pr-${i + 1}`),
		...Array.from({ length: 11 }, (_, i) => `grid-cols-${i + 1}`),
		...Array.from({ length: 11 }, (_, i) => `sm:grid-cols-${i + 1}`),
		...Array.from({ length: 11 }, (_, i) => `md:grid-cols-${i + 1}`),
		...Array.from({ length: 11 }, (_, i) => `lg:grid-cols-${i + 1}`),
		...Array.from({ length: 11 }, (_, i) => `xl:grid-cols-${i + 1}`),
		...Array.from(
			{ length: 6 },
			(_, i) => `group-hover:-translate-x-${(i + 1) * 12}`
		),
		...Array.from(
			{ length: 6 },
			(_, i) => `group-hover:translate-x-${(i + 1) * 12}`
		),
		'border-l-2',
		'bg-slate-800',
		'text-slate-800',
		'overflow-x-hidden',
		'max-w-none',
		'mx-0',
		'justify-items-center',
	],
	prefix: '',
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-inter)'],
			},
			colors: {
				'dark-gray': '#302f36',
				'background-secondary': 'hsl(var(--background-secondary))',
				'search-background': 'hsl(var(--search-background))',
				'light-red-bg': 'hsl(var(--light-red-bg))',
				'text-on-light-red': 'hsl(var(--text-on-light-red))',
				'dark-foreground': 'hsl(var(--dark-foreground))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				border: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				moveHorizontal: {
					'0%': {
						transform: 'translateX(-50%) translateY(-10%)',
					},
					'50%': {
						transform: 'translateX(50%) translateY(10%)',
					},
					'100%': {
						transform: 'translateX(-50%) translateY(-10%)',
					},
				},
				moveInCircle: {
					'0%': {
						transform: 'rotate(0deg)',
					},
					'50%': {
						transform: 'rotate(180deg)',
					},
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
				moveVertical: {
					'0%': {
						transform: 'translateY(-50%)',
					},
					'50%': {
						transform: 'translateY(50%)',
					},
					'100%': {
						transform: 'translateY(-50%)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				first: 'moveVertical 30s ease infinite',
				second: 'moveInCircle 20s reverse infinite',
				third: 'moveInCircle 40s linear infinite',
				fourth: 'moveHorizontal 40s ease infinite',
				fifth: 'moveInCircle 20s ease infinite',
			},
		},
	},
	future: {
		hoverOnlyWhenSupported: true,
	},
	plugins: [typography],
} satisfies Config;
