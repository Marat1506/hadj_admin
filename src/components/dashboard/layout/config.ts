import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Обзор', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Клиенты', href: paths.dashboard.customers, icon: 'users' },
  { key: 'carousel', title: 'Баннер', href: paths.dashboard.carousel, icon: 'images' },
  { key: 'gallery', title: 'Галерея', href: paths.dashboard.gallery, icon: 'images' },
  { key: 'news', title: 'Новости', href: paths.dashboard.news, icon: 'newspaper' },
  { key: 'checklists', title: 'Управление чеклистами', href: paths.dashboard.checklists, icon: 'checklists' },
  { key: 'attractions', title: 'Достопримечательности', href: paths.dashboard.attractions, icon: 'map-pin' },
  { key: 'navigation', title: 'Навигация', href: paths.dashboard.navigation, icon: 'buildings' },
  { key: 'guide', title: 'Гид паломника', href: paths.dashboard.guide, icon: 'guide' },
  { key: 'account', title: 'Аккаунт', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
