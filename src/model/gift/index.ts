export interface GiftProduct {
    product_id: string;
    product_img: string;
    product_name: string;
    product_price: number;
    max_sale: number;
    current_sale: number;
    product_description: string;
    sale_start_date: string | null;
    sale_end_date: string | null;
    discount_percent: number;
    discount_active?: boolean;
    discounted_price?: number;
    discount_start_date: string | null;
    discount_end_date: string | null;
    created_by_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface GiftCreatedBy {
    admin_id: string;
    fbuid: string;
    user_id: string;
    email: string;
    phone: string;
    profile: string;
    line: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface GiftItem {
    gift_id: string;
    product_id: string;
    receiver_id: string;
    organization_id: string;
    created_by_id: string;
    gift_price: number;
    status: string;
    message: string;
    expired_at: string;
    created_at: string;
    updated_at: string | null;
    product: GiftProduct;
    created_by: GiftCreatedBy;
}

export interface GiftListResponse {
    data: GiftItem[];
    status: number;
    error: boolean;
    message: string;
}
