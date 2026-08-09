import type { ElementType } from 'react';

export interface MenuItem {
  link?: string;
  action?: 'live';
  icon?: ElementType;
  badge?: string;
  authOnly?: boolean;
  vjOnly?: boolean;
  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'หน้าหลัก',
        link: '/home',
      },
      {
        name: 'เกี่ยวกับเรา',
        items: [
          {
            name: 'เกี่ยวกับ PX',
            link: '/about',
          },
          {
            name: 'กิจกรรม',
            link: '/activity',
          },
          {
            name: 'บทความ',
            link: '/article',
          },
        ],
      },
      {
        name: 'สังกัด',
        link: '/member/profile',
        authOnly: true,
        vjOnly: true,
      },
      {
        name: 'มินิแอป',
        authOnly: true,
        items: [
          {
            name: 'ตลาด PX',
            link: '/px_market',
          },
          {
            name: 'ห้องเสียง',
            link: '/voice-room',
          },
          {
            name: 'ยืนยันขึ้น Live',
            action: 'live',
            vjOnly: true,
          },
          {
            name: 'อังเปา',
            link: '/member/angpao',
          },
          {
            name: 'ของขวัญ',
            link: '/gift_box',
          },
          {
            name: 'รับคะแนน',
            link: '/profile/points_history',
          },
          {
            name: 'ห้องเรียนออนไลน์',
            link: '/member/training',
            vjOnly: true,
          },
        ],
      },
    ],
  },
];

const filterMenuItems = (items: MenuItem[], isAuthenticated: boolean, memberType?: string): MenuItem[] =>
  items
    .filter((item) => (!item.authOnly || isAuthenticated) && (!item.vjOnly || memberType !== 'general_member'))
    .map((item) => ({
      ...item,
      items: item.items ? filterMenuItems(item.items, isAuthenticated, memberType) : undefined,
    }))
    .filter((item) => !item.items || item.items.length > 0);

export const getVisibleMenuItems = (isAuthenticated: boolean, memberType?: string): MenuItems[] =>
  menuItems
    .map((section) => ({
      ...section,
      items: filterMenuItems(section.items, isAuthenticated, memberType),
    }))
    .filter((section) => section.items.length > 0);

export default menuItems;
