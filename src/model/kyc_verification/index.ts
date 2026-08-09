export interface KycVerification {
  kyc_verification_id: string;
  member_id: string;
  card_number: string;
  card_with_profile_img: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  reviewed_by_id: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  member?: {
    member_id: string;
    user_px: string;
    full_name: string;
    nick_name: string;
    email: string;
    phone: string;
    profile: string;
  };
  reviewed_by?: any;
}

export interface KycVerificationListResponse {
  data: KycVerification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  status: number;
  error: boolean;
  message: string;
}

