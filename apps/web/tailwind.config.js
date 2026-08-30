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
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        quad: 'rgb(var(--quad) / <alpha-value>)',
        marker: 'rgb(var(--marker) / <alpha-value>)',
        chalk: 'rgb(var(--chalk) / <alpha-value>)',
        graphite: 'rgb(var(--graphite) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Geist', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'IBM Plex Mono', 'SF Mono', 'monospace'],
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
      backgroundImage: {
        'ledger-grid': 'linear-gradient(to right, rgba(138, 141, 133, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(138, 141, 133, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
        'grid-md': '32px 32px',
        'grid-lg': '48px 48px',
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
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
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
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};