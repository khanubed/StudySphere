const { spacing, borderRadius } = (() => {
  try {
    return require('@studysphere/ui-tokens');
  } catch (e) {
    return {
      spacing: {
        scale: {
          1: '4px',
          2: '8px',
          3: '12px',
          4: '16px',
          6: '24px',
          8: '32px',
          12: '48px',
          16: '64px',
          24: '96px',
          32: '128px',
          48: '192px',
        },
      },
      borderRadius: {
        input: '0.5rem',
        button: '0.5rem',
        card: '0.5rem',
        modal: '1rem',
        badge: '9999px',
      },
    };
  }
})();

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        quad: "rgb(var(--quad) / <alpha-value>)",
        marker: "rgb(var(--marker) / <alpha-value>)",
        chalk: "rgb(var(--chalk) / <alpha-value>)",
        graphite: "rgb(var(--graphite) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      fontFamily: {
        display: 'System',
        sans: 'System',
        body: 'System',
        mono: 'monospace',
        code: 'monospace',
      },
      borderRadius: {
        lg: "var(--radius-modal, 1rem)",
        md: "var(--radius, 0.5rem)",
        sm: "calc(var(--radius, 0.5rem) - 2px)",
        input: borderRadius.input,
        button: borderRadius.button,
        card: borderRadius.card,
        modal: borderRadius.modal,
      },
      spacing: spacing.scale,
    },
  },
  plugins: [],
};