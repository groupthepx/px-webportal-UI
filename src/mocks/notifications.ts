export type NotificationIconKey =
  | 'kyc'
  | 'withdraw'
  | 'order'
  | 'coupon'
  | 'gift'
  | 'live'
  | 'points'
  | 'account'
  | 'training'
  | 'level'
  | 'recruitment'
  | 'content'
  | 'system';

export type PortalNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  color: string;
  iconKey: NotificationIconKey;
  category: string;
  timeLabel: string;
  isRead: boolean;
};

/**
 * Frontend-only records used until the notification API is connected.
 * Keep each event as a separate record so API responses can map directly to
 * the Navbar menu and the full notifications page.
 */
export const MOCK_PORTAL_NOTIFICATIONS: PortalNotification[] = [
  {
    id: 'kyc-approved',
    title: 'ยืนยันตัวตนผ่านแล้ว',
    description: 'ข้อมูล KYC ของคุณได้รับการยืนยันเรียบร้อยแล้ว',
    href: '/profile?tab=kyc',
    color: '#16a34a',
    iconKey: 'kyc',
    category: 'KYC',
    timeLabel: 'เมื่อ 5 นาทีที่แล้ว',
    isRead: false,
  },
  {
    id: 'kyc-rejected',
    title: 'KYC ไม่ผ่านการยืนยัน',
    description: 'กรุณาตรวจสอบเหตุผลและส่งข้อมูลยืนยันใหม่อีกครั้ง',
    href: '/profile?tab=kyc',
    color: '#dc2626',
    iconKey: 'kyc',
    category: 'KYC',
    timeLabel: 'เมื่อ 18 นาทีที่แล้ว',
    isRead: false,
  },
  {
    id: 'withdraw-requested',
    title: 'ส่งคำขอถอนเงินแล้ว',
    description: 'ระบบได้รับคำขอถอนเงินของคุณแล้ว อยู่ระหว่างตรวจสอบ',
    href: '/profile/withdraw_money',
    color: '#2563eb',
    iconKey: 'withdraw',
    category: 'การเงิน',
    timeLabel: 'เมื่อ 32 นาทีที่แล้ว',
    isRead: false,
  },
  {
    id: 'withdraw-approved',
    title: 'ถอนเงินสำเร็จ',
    description: 'คำขอถอนเงินได้รับการอนุมัติและดำเนินการเรียบร้อยแล้ว',
    href: '/profile/withdraw_money',
    color: '#16a34a',
    iconKey: 'withdraw',
    category: 'การเงิน',
    timeLabel: 'วันนี้ 10:45 น.',
    isRead: false,
  },
  {
    id: 'withdraw-rejected',
    title: 'คำขอถอนเงินถูกปฏิเสธ',
    description: 'กรุณาตรวจสอบรายละเอียดคำขอถอนเงินและดำเนินการอีกครั้ง',
    href: '/profile/withdraw_money',
    color: '#dc2626',
    iconKey: 'withdraw',
    category: 'การเงิน',
    timeLabel: 'วันนี้ 09:30 น.',
    isRead: true,
  },
  {
    id: 'market-order-created',
    title: 'สั่งซื้อสำเร็จ',
    description: 'คำสั่งซื้อจากตลาด PX ของคุณถูกสร้างเรียบร้อยแล้ว',
    href: '/profile/market_history',
    color: '#ea580c',
    iconKey: 'order',
    category: 'ตลาด PX',
    timeLabel: 'วันนี้ 09:10 น.',
    isRead: false,
  },
  {
    id: 'market-order-updated',
    title: 'อัปเดตคำสั่งซื้อ',
    description: 'สถานะคำสั่งซื้อของคุณมีการเปลี่ยนแปลง กดเพื่อดูรายละเอียด',
    href: '/profile/market_history',
    color: '#7c3aed',
    iconKey: 'order',
    category: 'ตลาด PX',
    timeLabel: 'เมื่อวาน 18:25 น.',
    isRead: true,
  },
  {
    id: 'coupon-received',
    title: 'คุณได้รับอังเปาใหม่',
    description: 'มีอังเปาที่รอให้คุณเปิดรับอยู่ในระบบ',
    href: '/member/angpao',
    color: '#db2777',
    iconKey: 'coupon',
    category: 'อังเปา',
    timeLabel: 'เมื่อ 1 ชั่วโมงที่แล้ว',
    isRead: false,
  },
  {
    id: 'gift-received',
    title: 'คุณได้รับของขวัญใหม่',
    description: 'มีของขวัญใหม่จากกิจกรรมและชุมชน VJ',
    href: '/gift_box',
    color: '#f59e0b',
    iconKey: 'gift',
    category: 'ของขวัญ',
    timeLabel: 'เมื่อ 2 ชั่วโมงที่แล้ว',
    isRead: false,
  },
  {
    id: 'live-submitted',
    title: 'ได้รับข้อมูลการขึ้น Live แล้ว',
    description: 'ระบบได้รับข้อมูลการยืนยันขึ้น Live ของคุณแล้ว',
    href: '/home/vj_star_live',
    color: '#ef4444',
    iconKey: 'live',
    category: 'STAR LIVE',
    timeLabel: 'วันนี้ 08:45 น.',
    isRead: true,
  },
  {
    id: 'live-approved',
    title: 'อนุมัติการขึ้น Live แล้ว',
    description: 'คุณสามารถเริ่มภารกิจ STAR LIVE ได้ตามเวลาที่กำหนด',
    href: '/home/vj_star_live',
    color: '#16a34a',
    iconKey: 'live',
    category: 'STAR LIVE',
    timeLabel: 'เมื่อวาน 20:15 น.',
    isRead: true,
  },
  {
    id: 'live-rejected',
    title: 'การขึ้น Live ไม่ได้รับการอนุมัติ',
    description: 'กรุณาตรวจสอบรายละเอียดและส่งคำขอใหม่ตามเงื่อนไข',
    href: '/home/vj_star_live',
    color: '#dc2626',
    iconKey: 'live',
    category: 'STAR LIVE',
    timeLabel: 'เมื่อวาน 16:40 น.',
    isRead: true,
  },
  {
    id: 'live-points-earned',
    title: 'คุณได้รับคะแนนจากการขึ้น Live',
    description: 'คะแนนจากภารกิจ STAR LIVE ถูกบันทึกเข้าบัญชีแล้ว',
    href: '/profile/points_history',
    color: '#ca8a04',
    iconKey: 'points',
    category: 'คะแนน',
    timeLabel: 'เมื่อวาน 15:20 น.',
    isRead: false,
  },
  {
    id: 'rank-bonus-earned',
    title: 'คุณได้รับโบนัสอันดับ',
    description: 'ตรวจสอบรายละเอียดโบนัสและประวัติการได้รับรางวัล',
    href: '/profile/points_history',
    color: '#9333ea',
    iconKey: 'points',
    category: 'โบนัส',
    timeLabel: '12 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'account-approved',
    title: 'สมัครสมาชิกสำเร็จ',
    description: 'ยินดีต้อนรับเข้าสู่ครอบครัว PX คุณสามารถเริ่มใช้งานได้แล้ว',
    href: '/member/home',
    color: '#0ea5e9',
    iconKey: 'account',
    category: 'บัญชีสมาชิก',
    timeLabel: '12 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'recruitment-app-approved',
    title: 'แอปใหม่ได้รับการอนุมัติ',
    description: 'แอปที่คุณสมัครเพิ่มพร้อมให้ดำเนินการตามขั้นตอนแล้ว',
    href: '/member/profile',
    color: '#f97316',
    iconKey: 'recruitment',
    category: 'การสรรหา',
    timeLabel: '11 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'training-reminder',
    title: 'บทเรียนยังเรียนไม่ครบ',
    description: 'มีบทเรียนที่รอให้คุณเรียนต่อ เพื่อปลดล็อกข้อสอบประจำบท',
    href: '/member/training',
    color: '#16a34a',
    iconKey: 'training',
    category: 'ห้องเรียนออนไลน์',
    timeLabel: '10 ก.ค. 2026',
    isRead: false,
  },
  {
    id: 'training-exam-ready',
    title: 'พร้อมทำข้อสอบแล้ว',
    description: 'คุณเรียนครบทุกหัวข้อในบทเรียนแล้ว กดเพื่อเข้าสู่หน้าข้อสอบ',
    href: '/member/training',
    color: '#2563eb',
    iconKey: 'training',
    category: 'ห้องเรียนออนไลน์',
    timeLabel: '10 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'level-up',
    title: 'คุณผ่าน Level ใหม่แล้ว',
    description: 'ตรวจสอบความคืบหน้า คะแนน และเงื่อนไขของแอปที่เกี่ยวข้อง',
    href: '/member/level',
    color: '#7c3aed',
    iconKey: 'level',
    category: 'Level',
    timeLabel: '9 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'article-published',
    title: 'มีบทความใหม่จาก PX',
    description: 'อ่านข่าวสารและเรื่องราวใหม่จากทีมงาน PX ได้แล้ว',
    href: '/article',
    color: '#0284c7',
    iconKey: 'content',
    category: 'บทความ',
    timeLabel: '8 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'activity-published',
    title: 'มีกิจกรรมใหม่',
    description: 'ติดตามกิจกรรมและความเคลื่อนไหวล่าสุดของชุมชน PX',
    href: '/activity',
    color: '#ea580c',
    iconKey: 'content',
    category: 'กิจกรรม',
    timeLabel: '8 ก.ค. 2026',
    isRead: true,
  },
  {
    id: 'close-balance-completed',
    title: 'ปิดยอดรอบล่าสุดแล้ว',
    description: 'ตรวจสอบยอดรายได้และรายละเอียดการปิดยอดของแต่ละแอป',
    href: '/member/history',
    color: '#0f766e',
    iconKey: 'system',
    category: 'ปิดยอด',
    timeLabel: '7 ก.ค. 2026',
    isRead: true,
  },
];
