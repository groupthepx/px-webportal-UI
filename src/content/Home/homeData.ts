import type { MemberDetailModel, MemberOrganization } from '@/model/member';

export type KycState = 'approved' | 'pending' | 'rejected' | 'not_started';

export type KycSummary = {
  state: KycState;
  label: string;
  detail: string;
  color: string;
};

export type MemberApplication = {
  id: string;
  name: string;
  logo: string;
  status: string;
  statusColor: string;
  isActive: boolean;
  joinedAt: string;
  referId: string;
  coinBalance: number;
  level: string;
  progress: number;
  userId: string;
  roomId: string;
  training: TrainingSummary;
};

export type TrainingSummary = {
  totalLessons: number;
  completedLessons: number;
  passedExams: number;
  failedExams: number;
  remainingLessons: number;
};

export const buildUploadUrl = (path?: string | null) => {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_UPLOADS?.replace(/\/$/, '');
  return base ? `${base}/${path.replace(/^\//, '')}` : path;
};

export function getKycSummary(member?: MemberDetailModel | null): KycSummary {
  const records = member?.kyc_verification ?? [];
  const current = records.find((item) => !item.deleted_at);

  if (current?.status === 'approved') {
    return { state: 'approved', label: 'ผ่านการยืนยัน KYC', detail: 'ข้อมูลตัวตนได้รับการตรวจสอบแล้ว', color: '#16a34a' };
  }

  if (current?.status === 'pending') {
    return { state: 'pending', label: 'อยู่ระหว่างตรวจสอบ KYC', detail: 'ทีมงานกำลังตรวจสอบข้อมูลของคุณ', color: '#f59e0b' };
  }

  if (current?.status === 'rejected') {
    return { state: 'rejected', label: 'ต้องส่งข้อมูล KYC ใหม่', detail: current.rejection_reason || 'กรุณาตรวจสอบและส่งข้อมูลอีกครั้ง', color: '#dc2626' };
  }

  return { state: 'not_started', label: 'ยังไม่ได้ยืนยัน KYC', detail: 'ยืนยันตัวตนเพื่อใช้งานการถอนเงินและฟังก์ชันที่เกี่ยวข้อง', color: '#64748b' };
}

export function getAvailableBonus(member?: MemberDetailModel | null) {
  return (member?.coupon ?? [])
    .filter((coupon: any) => ['sending', 'available', 'pending'].includes(String(coupon.status)))
    .reduce((total: number, coupon: any) => total + Number(coupon.amount || 0), 0);
}

const getApplicationProgress = (organization: MemberOrganization) => {
  if (organization.vj_active) return { progress: 100, level: 'Level 2', status: 'เปิดใช้งาน', color: '#16a34a' };
  if (organization.train_ten_step || organization.sapphipe) return { progress: 70, level: 'Level 1', status: 'ผ่านการฝึก', color: '#f59e0b' };
  return { progress: 25, level: 'เริ่มต้น', status: 'กำลังดำเนินการ', color: '#64748b' };
};

const readNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
};

export function getTrainingSummary(organization?: Partial<MemberOrganization> & Record<string, any> | null): TrainingSummary {
  const completedLessons = Array.isArray(organization?.completed_lessons)
    ? organization.completed_lessons.length
    : readNumber(organization?.completed_lessons_count);
  const totalLessons = Math.max(
    readNumber(organization?.total_lessons || organization?.lesson_total || organization?.course_total, 4),
    completedLessons,
  );
  const passedExams = Array.isArray(organization?.passed_exams)
    ? organization.passed_exams.length
    : readNumber(organization?.passed_exams_count || organization?.exam_passed_count);
  const failedExams = Array.isArray(organization?.failed_exams)
    ? organization.failed_exams.length
    : readNumber(organization?.failed_exams_count || organization?.exam_failed_count);

  return {
    totalLessons,
    completedLessons: Math.min(completedLessons, totalLessons),
    passedExams,
    failedExams,
    remainingLessons: Math.max(totalLessons - completedLessons, 0),
  };
}

export function getMemberApplications(member?: MemberDetailModel | null): MemberApplication[] {
  const wallets = member?.member_wallet ?? [];

  return (member?.member_organization ?? [])
    .filter((organization) => organization.is_active !== false)
    .map((organization) => {
      const rawOrganization = organization as MemberOrganization & Record<string, any>;
      const progress = getApplicationProgress(organization);
      const isActive = organization.is_active !== false;
      const organizationWallet = wallets.find(
        (wallet) => String(wallet.organization_id) === String(organization.organization_id),
      );
      return {
        id: String(organization.organization_id),
        name: organization.organization?.company_name || 'App ของคุณ',
        logo: buildUploadUrl(organization.organization?.company_logo),
        status: isActive ? 'ใช้งาน' : 'ปิดใช้งาน',
        statusColor: isActive ? '#16a34a' : '#dc2626',
        isActive,
        joinedAt: organization.joined_at || '',
        referId: rawOrganization.refer_id || member?.refer_id || 'N/A',
        coinBalance: Number(organizationWallet?.wallet?.coin || 0),
        level: rawOrganization.level || rawOrganization.vj_level || progress.level,
        progress: progress.progress,
        userId: organization.user_id || '-',
        roomId: organization.room_id || '-',
        training: getTrainingSummary(organization),
      };
    });
}

export function getMemberDisplayName(member?: MemberDetailModel | null, fallback = 'VJ Member') {
  return member?.nick_name || member?.full_name || fallback;
}
