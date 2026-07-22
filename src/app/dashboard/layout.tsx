import Link from 'next/link';
import Image from 'next/image';

import classes from './styles.module.css';

import { config } from '@/core/configs';
import { ChangeTheme } from '@/features/change-theme';
import { Notifications } from '@/features/notifications';
import {
  DashboardMobileNavigation,
  DashboardNavigation,
} from '@/shared/ui/DashboardNavigation';
import { AccountNavigation } from '@/shared/ui/AccountNavigation';
import { DonationPro } from '@/shared/ui/DonationPro';
import logo from '@/assets/logos/logo.svg';

export default function Page({ children }: React.PropsWithChildren) {
  return (
    <div className={classes.layout}>
      <aside className={classes.aside}>
        <div className={classes.aside__wrapper}>
          <div className={classes['aside__wrapper-logo']}>
            <Link href="/" className={classes.aside__logo}>
              <Image src={logo} alt="Gml Panel" />
              <span className={classes.aside__name}>{config.name}</span>
              <span className={classes.aside__meta}>
                <span className={classes.version}>{config.version}</span>
                <span className={classes.aside__credit}>{config.credit}</span>
              </span>
            </Link>
          </div>
          <DashboardNavigation />
          <div className={classes.aside__pro}>
            <DonationPro />
          </div>
        </div>
      </aside>
      <div className={classes.content}>
        <header className={classes.header}>
          <DashboardMobileNavigation />
          <div className={classes.header__actions}>
            <Notifications />
            <ChangeTheme />
            <AccountNavigation />
          </div>
        </header>
        <main className={classes.main}>{children}</main>
      </div>
    </div>
  );
}
