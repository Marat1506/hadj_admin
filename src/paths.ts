export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    settings: '/dashboard/settings',
    carousel: '/dashboard/carousel',
    news: '/dashboard/news',
    checklists: '/dashboard/checklists',
    attractions: '/dashboard/attractions',
    navigation: '/dashboard/navigation',
    guide: '/dashboard/guide',
    gallery: '/dashboard/gallery',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
