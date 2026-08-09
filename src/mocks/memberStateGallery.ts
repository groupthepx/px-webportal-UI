export type MockMemberType = 'vj_member' | 'general_member';
export type MockStateTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'primary';
export type MockPortalSection = 'profile' | 'bonus' | 'quick_actions' | 'level_progress' | 'top_vj' | 'transactions' | 'notifications' | 'voice_room';
export type MockQuickAction = 'live' | 'voice' | 'market' | 'angpao' | 'gift' | 'training' | 'bank' | 'history';

export type MockState = {
  id: string;
  label: string;
  description: string;
  tone: MockStateTone;
  progress?: number;
  meta?: string;
};

export type MockTransactionRow = {
  id: string;
  type: 'income' | 'expense';
  appName: string;
  format: 'เงิน' | 'Coin PX' | 'คะแนน';
  item: string;
  status: 'success' | 'pending' | 'rejected' | 'refunded';
  amount: number;
  date: string;
};

export type MockNotification = MockState & {
  unread: boolean;
  href: string;
};

export type MemberStateGallery = {
  memberType: MockMemberType;
  memberLabel: string;
  memberName: string;
  memberId: string;
  summary: string;
  kycStates: MockState[];
  appStates: MockState[];
  trainingStates: MockState[];
  levelStates: MockState[];
  rewardStates: MockState[];
  transactionRows: MockTransactionRow[];
  notificationStates: MockNotification[];
  voiceStates: MockState[];
  sharedStates: string[];
  pageLinks: Array<{ label: string; href: string }>;
};

export type MemberPortalPreview = {
  sections: MockPortalSection[];
  quickActions: MockQuickAction[];
};

const kycStates: MockState[] = [
  { id: 'not_submitted', label: 'ยังไม่ได้ยืนยัน KYC', description: 'ผู้ใช้ยังไม่ได้ส่งเอกสาร', tone: 'neutral' },
  { id: 'pending', label: 'กำลังตรวจสอบ', description: 'รอ Admin ตรวจสอบข้อมูล', tone: 'warning' },
  { id: 'approved', label: 'ยืนยันแล้ว', description: 'ผ่านการตรวจสอบและใช้งานฟังก์ชันที่เกี่ยวข้องได้', tone: 'success' },
  { id: 'rejected', label: 'ไม่ผ่านการยืนยัน', description: 'มีหมายเหตุจาก Admin และส่งข้อมูลใหม่ได้', tone: 'error' },
];

const sharedStates = ['wallet', 'bank_account', 'history', 'notifications', 'voice_room', 'market', 'angpao', 'gift_box', 'points'];

const voiceStates: MockState[] = [
  { id: 'available', label: 'เข้าห้องได้', description: 'ห้องเสียงเปิดและยังมีที่ว่าง', tone: 'success', meta: '12/50 คน' },
  { id: 'in_room', label: 'อยู่ในห้อง', description: 'ผู้ใช้กำลังสนทนาอยู่ในห้องเสียง', tone: 'primary', meta: 'กำลังสนทนา 08:42 นาที' },
  { id: 'full', label: 'ห้องเต็ม', description: 'ห้องเต็มชั่วคราว สามารถลองใหม่ภายหลัง', tone: 'warning', meta: '50/50 คน' },
];

const vjGallery: MemberStateGallery = {
  memberType: 'vj_member',
  memberLabel: 'VJ User',
  memberName: 'Friend นานา',
  memberId: 'PX-12345',
  summary: 'ผู้ใช้ที่มี App สังกัด และทำภารกิจ Level, Training และ STAR LIVE',
  kycStates,
  appStates: [
    { id: 'active', label: 'เปิดใช้งาน', description: 'App ใช้งานได้ตามปกติ', tone: 'success', meta: 'Pati · Level 2' },
    { id: 'training', label: 'กำลังฝึก 7 วัน', description: 'ผ่าน HR แล้ว รอฝึกและติดตามผล', tone: 'warning', progress: 57, meta: 'วันที่ 4/7' },
    { id: 'web_pending', label: 'รออนุมัติเข้าระบบ', description: 'ผ่านการฝึกแล้ว รอ Web Admin อนุมัติ', tone: 'info', meta: 'TikTok · Level New' },
    { id: 'disabled', label: 'ปิดใช้งาน', description: 'Admin ปิด App นี้ ผู้ใช้จะไม่เห็นในการใช้งานจริง', tone: 'error', meta: 'SUGO.' },
  ],
  trainingStates: [
    { id: 'locked', label: 'ยังไม่เปิดเรียน', description: 'ต้องผ่านเงื่อนไขของ App ก่อน', tone: 'neutral', progress: 0 },
    { id: 'in_progress', label: 'กำลังเรียน', description: 'เรียนบางหัวข้อแล้ว ยังไม่เปิดสอบ', tone: 'warning', progress: 58, meta: '3/5 หัวข้อ' },
    { id: 'ready', label: 'พร้อมสอบ', description: 'เรียนครบทุกหัวข้อในบทเรียนแล้ว', tone: 'info', progress: 100, meta: 'เหลือสิทธิ์สอบ 2 ครั้ง' },
    { id: 'passed', label: 'สอบผ่าน', description: 'จบบทเรียนและข้อสอบเรียบร้อย', tone: 'success', progress: 100, meta: 'คะแนน 86/100' },
    { id: 'retryable', label: 'สอบไม่ผ่าน · สอบใหม่ได้', description: 'ยังเหลือโควตาสอบตามที่ Admin ตั้งไว้', tone: 'error', progress: 100, meta: 'เหลือ 1/3 ครั้ง' },
    { id: 'exhausted', label: 'สอบไม่ผ่าน · หมดโควตา', description: 'ไม่สามารถเริ่มสอบใหม่ได้จนกว่า Admin จะ reset', tone: 'error', progress: 100, meta: 'เหลือ 0/3 ครั้ง' },
  ],
  levelStates: [
    { id: 'level_1', label: 'Level 1', description: 'เริ่มต้นเป็น VJ และทำเงื่อนไขพื้นฐาน', tone: 'success', progress: 100, meta: '100/100 คะแนน' },
    { id: 'level_2', label: 'Level 2', description: 'กำลังเก็บคะแนนและรอเงื่อนไข Manual', tone: 'warning', progress: 62, meta: '62/100 คะแนน' },
    { id: 'level_3', label: 'Level 3', description: 'ยังมีเงื่อนไขบางรายการที่ถูกล็อก', tone: 'info', progress: 24, meta: '24/100 คะแนน' },
    { id: 'level_4', label: 'Level 4', description: 'ยังไม่เริ่ม เนื่องจาก Level ก่อนหน้ายังไม่ครบ', tone: 'neutral', progress: 0, meta: '0/100 คะแนน' },
  ],
  rewardStates: [
    { id: 'angpao_pending', label: 'อังเปา · รอรับ', description: 'มีรายการใหม่ในกระเป๋า', tone: 'warning', meta: '30 Coin PX' },
    { id: 'angpao_received', label: 'อังเปา · รับแล้ว', description: 'บันทึกเป็นธุรกรรมรายรับ', tone: 'success', meta: '100 Coin PX' },
    { id: 'gift_pending', label: 'ของขวัญ · รอรับ', description: 'ยืนยันรับของขวัญเพื่อบันทึกเข้าประวัติ', tone: 'warning', meta: '1 รายการ' },
    { id: 'score_received', label: 'คะแนน · ได้รับแล้ว', description: 'คะแนนจาก Live หรือ Admin', tone: 'success', meta: '+50 คะแนน' },
  ],
  transactionRows: [
    { id: 'vj-income-live', type: 'income', appName: 'Pati', format: 'คะแนน', item: 'คะแนนจากการขึ้น Live', status: 'success', amount: 100, date: '08/08/2026 10:52' },
    { id: 'vj-admin-score', type: 'income', appName: 'TikTok', format: 'คะแนน', item: 'แจกคะแนนโดย Admin', status: 'success', amount: 50, date: '07/08/2026 16:20' },
    { id: 'vj-gift', type: 'income', appName: 'SUGO.', format: 'Coin PX', item: 'ได้รับของขวัญ', status: 'pending', amount: 300, date: '06/08/2026 13:18' },
    { id: 'vj-market', type: 'expense', appName: 'TikTok', format: 'Coin PX', item: 'แลกของจาก PX Market', status: 'success', amount: 500, date: '05/08/2026 09:04' },
    { id: 'vj-withdraw', type: 'expense', appName: 'Pati', format: 'เงิน', item: 'ถอนเงิน', status: 'rejected', amount: 1200, date: '04/08/2026 18:42' },
  ],
  notificationStates: [
    { id: 'lesson_reminder', label: 'แจ้งเตือนบทเรียน', description: 'เหลือหัวข้อที่ต้องเรียนอีก 2 หัวข้อ', tone: 'warning', unread: true, href: '/member/training' },
    { id: 'level_completed', label: 'Level 1 สำเร็จ', description: 'ได้รับ 100 คะแนนจากการสำเร็จ Level', tone: 'success', unread: true, href: '/member/level' },
    { id: 'angpao_received', label: 'ได้รับอังเปา', description: 'มีอังเปาใหม่ 30 Coin PX', tone: 'primary', unread: true, href: '/member/angpao' },
    { id: 'kyc_rejected', label: 'KYC ไม่ผ่าน', description: 'กรุณาตรวจสอบหมายเหตุและส่งข้อมูลใหม่', tone: 'error', unread: false, href: '/profile' },
    { id: 'app_approved', label: 'App อนุมัติแล้ว', description: 'Pati เปิดใช้งานในบัญชีของคุณแล้ว', tone: 'info', unread: false, href: '/member/profile' },
  ],
  voiceStates,
  sharedStates,
  pageLinks: [
    { label: 'หน้าหลัก VJ', href: '/home' },
    { label: 'สังกัด / App', href: '/member/profile' },
    { label: 'บทเรียน', href: '/member/training' },
    { label: 'Level', href: '/member/level' },
    { label: 'ธุรกรรมรวม', href: '/member/history' },
  ],
};

const generalGallery: MemberStateGallery = {
  memberType: 'general_member',
  memberLabel: 'General User',
  memberName: 'Pati ผู้ใช้ทั่วไป',
  memberId: 'PX-90876',
  summary: 'ผู้ใช้ที่ไม่มี App สังกัด ใช้กระเป๋า PX และฟังก์ชันส่วนกลางของระบบ',
  kycStates,
  appStates: [
    { id: 'no_affiliation', label: 'ไม่มี App สังกัด', description: 'ไม่แสดงข้อมูล App, Level, Training หรือภารกิจของ VJ', tone: 'neutral', meta: 'General wallet' },
  ],
  trainingStates: [],
  levelStates: [],
  rewardStates: [
    { id: 'angpao_pending', label: 'อังเปา · รอรับ', description: 'อังเปาจาก Admin ในกระเป๋า PX', tone: 'warning', meta: '20 Coin PX' },
    { id: 'angpao_received', label: 'อังเปา · รับแล้ว', description: 'แสดงเป็นรายรับทั่วไป ไม่ระบุ App', tone: 'success', meta: '100 Coin PX' },
    { id: 'gift_pending', label: 'ของขวัญ · รอรับ', description: 'รายการของขวัญจาก Admin', tone: 'warning', meta: '1 รายการ' },
    { id: 'score_received', label: 'คะแนน · ได้รับแล้ว', description: 'คะแนนจาก Admin หรือการแนะนำเพื่อน', tone: 'success', meta: '+30 คะแนน' },
  ],
  transactionRows: [
    { id: 'general-refer', type: 'income', appName: 'ทั่วไป', format: 'Coin PX', item: 'โบนัสแนะนำเพื่อน', status: 'success', amount: 50, date: '08/08/2026 10:52' },
    { id: 'general-score', type: 'income', appName: 'ทั่วไป', format: 'คะแนน', item: 'แจกคะแนนโดย Admin', status: 'success', amount: 30, date: '07/08/2026 16:20' },
    { id: 'general-angpao', type: 'income', appName: 'ทั่วไป', format: 'Coin PX', item: 'ได้รับอังเปา', status: 'pending', amount: 20, date: '06/08/2026 13:18' },
    { id: 'general-gift', type: 'income', appName: 'ทั่วไป', format: 'Coin PX', item: 'ได้รับของขวัญ', status: 'success', amount: 150, date: '05/08/2026 09:04' },
    { id: 'general-withdraw', type: 'expense', appName: 'ทั่วไป', format: 'เงิน', item: 'ถอนเงิน', status: 'rejected', amount: 800, date: '04/08/2026 18:42' },
  ],
  notificationStates: [
    { id: 'general_angpao', label: 'ได้รับอังเปา', description: 'มีอังเปาใหม่ในกระเป๋า PX', tone: 'primary', unread: true, href: '/member/angpao' },
    { id: 'general_score', label: 'ได้รับคะแนน', description: 'Admin เพิ่มคะแนนให้คุณ', tone: 'success', unread: true, href: '/profile/points_history' },
    { id: 'general_gift', label: 'ได้รับของขวัญ', description: 'มีของขวัญใหม่ให้กดยืนยันรับ', tone: 'warning', unread: true, href: '/gift_box' },
    { id: 'general_withdraw', label: 'สถานะการถอนเงิน', description: 'รายการถอนเงินไม่ผ่าน กรุณาตรวจสอบ', tone: 'error', unread: false, href: '/profile/withdraw_money' },
    { id: 'general_system', label: 'ประกาศจากระบบ', description: 'ติดตามข่าวสารและกิจกรรมของ PX', tone: 'info', unread: false, href: '/activity' },
  ],
  voiceStates,
  sharedStates,
  pageLinks: [
    { label: 'หน้าหลัก General', href: '/home' },
    { label: 'กระเป๋า PX', href: '/member/wallet' },
    { label: 'ธุรกรรมรวม', href: '/member/history' },
    { label: 'อังเปา', href: '/member/angpao' },
    { label: 'ห้องเสียง', href: '/voice-room' },
  ],
};

const galleryByMemberType: Record<MockMemberType, MemberStateGallery> = {
  vj_member: vjGallery,
  general_member: generalGallery,
};

const portalPreviewByMemberType: Record<MockMemberType, MemberPortalPreview> = {
  vj_member: {
    sections: ['profile', 'bonus', 'quick_actions', 'level_progress', 'top_vj', 'transactions', 'notifications', 'voice_room'],
    quickActions: ['live', 'voice', 'market', 'angpao', 'gift', 'training', 'bank', 'history'],
  },
  general_member: {
    sections: ['profile', 'bonus', 'quick_actions', 'top_vj', 'transactions', 'notifications', 'voice_room'],
    quickActions: ['voice', 'market', 'angpao', 'gift', 'bank', 'history'],
  },
};

export const getMemberStateGallery = (memberType: MockMemberType): MemberStateGallery => galleryByMemberType[memberType];
export const getMemberPortalPreview = (memberType: MockMemberType): MemberPortalPreview => portalPreviewByMemberType[memberType];

export const memberStateGallery = galleryByMemberType;
