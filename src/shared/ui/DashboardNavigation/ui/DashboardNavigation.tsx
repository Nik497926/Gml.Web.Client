'use client';

import { useMemo } from 'react';
import {
  ArrowUpDownIcon,
  BlocksIcon,
  FolderOpenIcon,
  PieChartIcon,
  SettingsIcon,
  ShoppingCartIcon,
  Users2Icon,
} from 'lucide-react';

import { DesktopNavigation } from '@/shared/ui/DesktopNavigation';
import { MobileNavigation } from '@/shared/ui/MobileNavigation';
import { DASHBOARD_PAGES } from '@/shared/routes';
import { Badge } from '@/shared/ui/badge';
import { TMenuItem } from '@/shared/types';
import { hasPermission, PERMISSIONS } from '@/shared/lib/permissions';

const baseMenu: TMenuItem[] = [
  {
    icon: <BlocksIcon size={16} />,
    path: DASHBOARD_PAGES.PROFILES,
    text: 'Профили',
  },
  {
    icon: <ShoppingCartIcon size={16} />,
    path: DASHBOARD_PAGES.MARKETPLACE,
    text: (
      <>
        Маркетплейс
        <Badge className="ml-1" variant="secondary">
          beta
        </Badge>
      </>
    ),
  },
  {
    icon: <ArrowUpDownIcon size={16} />,
    path: DASHBOARD_PAGES.INTEGRATIONS,
    text: 'Интеграции',
  },
  {
    icon: <Users2Icon size={16} />,
    path: DASHBOARD_PAGES.PLAYERS,
    text: 'Игроки',
  },
  {
    icon: <PieChartIcon size={16} />,
    path: DASHBOARD_PAGES.SENTRY,
    text: 'Ошибки',
  },
  {
    icon: <SettingsIcon size={16} />,
    path: DASHBOARD_PAGES.SETTINGS,
    text: 'Настройки',
  },
];

export function DashboardNavigation() {
  const menu = useMemo(() => {
    const items = [...baseMenu];
    if (hasPermission(PERMISSIONS.FILES_GLOBAL_MANAGE)) {
      items.splice(1, 0, {
        icon: <FolderOpenIcon size={16} />,
        path: DASHBOARD_PAGES.FILES,
        text: 'Файлы',
      });
    }
    return items;
  }, []);

  return (
    <>
      <DesktopNavigation menu={menu} />
    </>
  );
}

export function DashboardMobileNavigation() {
  const menu = useMemo(() => {
    const items = [...baseMenu];
    if (hasPermission(PERMISSIONS.FILES_GLOBAL_MANAGE)) {
      items.splice(1, 0, {
        icon: <FolderOpenIcon size={16} />,
        path: DASHBOARD_PAGES.FILES,
        text: 'Файлы',
      });
    }
    return items;
  }, []);

  return <MobileNavigation menu={menu} />;
}
