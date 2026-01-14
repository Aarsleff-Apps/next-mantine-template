import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconHome,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
} from '@tabler/icons-react';
import { ScrollArea } from '@mantine/core';
import { LinksGroup } from './NavbarLinksGroup/NavbarLinksGroup';
import { UserButton } from './UserButton/UserButton';
import classes from './SideNav.module.css';

export const linkData = [
  { label: 'Home', icon: IconHome, link: '/test' },
  {
    label: 'Market news',
    icon: IconNotes,
    links: [
      { label: 'Home', link: '/' },
      { label: 'Forecasts', link: '/new/forecasts' },
      { label: 'Outlook', link: '/new/outlook' },
      { label: 'Real time', link: '/new/real-time' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/releases/upcoming' },
      { label: 'Previous releases', link: '/releases/previous' },
      { label: 'Releases schedule', link: '/releases/schedule' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/security/2fa' },
      { label: 'Change password', link: '/security/change-password' },
      { label: 'Recovery codes', link: '/security/recovery-codes' },
    ],
  },
];

export default function SideNav() {
  const links = linkData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
