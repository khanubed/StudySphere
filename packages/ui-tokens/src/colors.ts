export const colors = {
  light: {
    ink: '18 21 28', // #12151C - near-black with cool blue undertone
    paper: '243 244 239', // #F3F4EF - cool, slightly grey-green off-white
    quad: '47 93 80', // #2F5D50 - deep academic green
    marker: '242 193 78', // #F2C14E - highlighter yellow
    chalk: '91 127 222', // #5B7FDE - muted academic blue
    graphite: '138 141 133', // #8A8D85 - neutral for captions, dividers
    background: '243 244 239', // Paper
    foreground: '18 21 28', // Ink
    primary: '47 93 80', // Quad
    'primary-foreground': '243 244 239', // Paper
    secondary: '220 222 214', // Paper muted
    'secondary-foreground': '18 21 28', // Ink
    muted: '220 222 214',
    'muted-foreground': '138 141 133', // Graphite
    accent: '242 193 78', // Marker
    'accent-foreground': '18 21 28', // Ink
    destructive: '185 28 28',
    'destructive-foreground': '243 244 239',
    card: '243 244 239',
    'card-foreground': '18 21 28',
    popover: '243 244 239',
    'popover-foreground': '18 21 28',
    border: '200 203 194',
    input: '200 203 194',
    ring: '47 93 80',
    success: '47 93 80',
    warning: '242 193 78',
  },
  dark: {
    ink: '243 244 239', // Paper (inverted)
    paper: '18 21 28', // Ink (inverted)
    quad: '76 160 138', // Lighter quad for dark mode
    marker: '242 193 78', // Marker stays same
    chalk: '130 160 240', // Lighter chalk for dark mode
    graphite: '160 162 155', // Lighter graphite for dark mode
    background: '18 21 28', // Ink
    foreground: '243 244 239', // Paper
    primary: '76 160 138', // Lighter quad
    'primary-foreground': '18 21 28', // Ink
    secondary: '35 38 44',
    'secondary-foreground': '243 244 239',
    muted: '35 38 44',
    'muted-foreground': '160 162 155',
    accent: '242 193 78',
    'accent-foreground': '18 21 28',
    destructive: '239 68 68',
    'destructive-foreground': '18 21 28',
    card: '28 31 38',
    'card-foreground': '243 244 239',
    popover: '28 31 38',
    'popover-foreground': '243 244 239',
    border: '55 58 53',
    input: '55 58 53',
    ring: '76 160 138',
    success: '76 160 138',
    warning: '242 193 78',
  },
};

export const spacing = {
  base: 4,
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
};

export const borderRadius = {
  input: '0.5rem',
  button: '0.5rem',
  card: '0.5rem',
  modal: '1rem',
  badge: '9999px',
};

export const fonts = {
  display: '"Fraunces", "Georgia", serif',
  sans: '"Geist", "system-ui", sans-serif',
  body: '"Inter", "system-ui", sans-serif',
  mono: '"Geist Mono", "SF Mono", "monospace"',
  code: '"IBM Plex Mono", "SF Mono", "monospace"',
};

export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
  '8xl': '6rem', // 96px
  '9xl': '8rem', // 128px
};

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const lineHeights = {
  tight: '1.05',
  snug: '1.25',
  normal: '1.6',
  relaxed: '1.75',
};

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.02em',
  wider: '0.05em',
  widest: '0.1em',
};