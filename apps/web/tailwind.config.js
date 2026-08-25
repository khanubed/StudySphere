import { spacing, borderRadius } from '@studysphere/ui-tokens';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        ink: 'rgb(var(--ink))',
        paper: 'rgb(var(--paper))',
        quad: 'rgb(var(--quad))',
        marker: 'rgb(var(--marker))',
        chalk: 'rgb(var(--chalk))',
        graphite: 'rgb(var(--graphite))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))',
        },
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        success: 'rgb(var(--success))',
        warning: 'rgb(var(--warning))',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Geist', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'SF Mono', 'monospace'],
        code: ['var(--font-code)', 'IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius-modal, 1rem)',
        md: 'var(--radius, 0.5rem)',
        sm: 'calc(var(--radius, 0.5rem) - 2px)',
        input: borderRadius.input,
        button: borderRadius.button,
        card: borderRadius.card,
        modal: borderRadius.modal,
      },
      spacing: spacing.scale,
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(0.5em)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'type-in': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'divider-draw': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'stamp-in': {
          from: { opacity: '0', transform: 'scale(0.5) rotate(-10deg)' },
          to: { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'count-up': 'count-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'type-in': 'type-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'divider-draw': 'divider-draw 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'stamp-in': 'stamp-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}