export const deepLinkingConfig = {
  prefixes: ['studysphere://', 'https://studysphere.app', 'https://*.studysphere.app'],
  config: {
    screens: {
      '(tabs)': {
        screens: {
          dashboard: 'dashboard',
          resources: 'resources',
          ai: 'ai',
          coding: 'coding',
          faculty: 'faculty',
          more: 'more',
        },
      },
      'resources/[id]': 'resources/:id',
      'ai/summarizer': 'ai/summarizer',
      'ai/quiz-attempt': 'quiz/:id',
      'ai/quiz-results': 'quiz/results/:id',
      'ai/planner': 'planner',
      'coding/[slug]': 'coding/:slug',
      'career/index': 'career',
      'career/[id]': 'career/:id',
      'alumni/index': 'alumni',
      'alumni/[id]': 'alumni/:id',
      'live-quiz/join': 'live-quiz/join/:code',
      'live-quiz/play': 'live-quiz/play/:sessionId',
      'billing': 'billing',
      'notifications': 'notifications',
      'profile': 'profile',
    },
  },
};

export default deepLinkingConfig;
