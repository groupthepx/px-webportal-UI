/**
 * Custom Hook: useMemberForm
 * จัดการ form state, validation และ submission สำหรับแก้ไข member
 */

import { useCallback, useEffect } from 'react';
import { useUpdateMemberMutation } from '@/lib/features/member';
import { enqueueSnackbar } from 'notistack';
import { Zoom } from '@mui/material';
import { format } from 'date-fns';
import { MESSAGES } from '../constants';
import { MemberFormValues } from '../types';
import { MemberDetailModel } from '@/model/member';

interface UseMemberFormProps {
  member: MemberDetailModel | null;
  fileImages?: Blob | null;  // <-- รับ fileImages จาก useImageCrop
  onSuccess?: () => void;
  onError?: () => void;
}

interface UseMemberFormReturn {
  isUpdating: boolean;
  isUpdateSuccess: boolean;
  isUpdateError: boolean;
  handleSubmit: (values: MemberFormValues) => void;
  updateMember: ReturnType<typeof useUpdateMemberMutation>[0];
}

/**
 * Hook สำหรับจัดการ member form
 */
export const useMemberForm = ({ 
  member,
  fileImages,  // <-- รับจาก useImageCrop
  onSuccess, 
  onError 
}: UseMemberFormProps): UseMemberFormReturn => {
  // Mutation สำหรับอัพเดท member
  const [
    updateMember,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
    },
  ] = useUpdateMemberMutation();

  // Handle success/error
  useEffect(() => {
    if (isUpdateSuccess) {
      enqueueSnackbar(MESSAGES.success.update, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        TransitionComponent: Zoom,
      });
      onSuccess?.();
    }

    if (isUpdateError) {
      enqueueSnackbar(MESSAGES.error.update, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        TransitionComponent: Zoom,
      });
      onError?.();
    }
  }, [isUpdateSuccess, isUpdateError, onSuccess, onError]);

  /**
   * Submit form data
   */
  const handleSubmit = useCallback((values: MemberFormValues) => {
    if (!member?.member_id) return;

    const formData = new FormData();

    // เพิ่มรูปภาพถ้ามี
    if (fileImages) {
      formData.append('profile', fileImages);
    }

    // เพิ่มข้อมูลต่างๆ
    // formData.append('room_id', values.room_id);
    // formData.append('user_id', values.user_id);
    formData.append('nick_name', values.nick_name);
    formData.append('full_name', values.full_name);
    formData.append('secu_name', values.secu_name);
    formData.append('dob', values.dob ? format(new Date(values.dob), 'MM/dd/yyyy') : '');
    formData.append('province', values.province);
    formData.append('subdistrict', values.subdistrict);
    formData.append('zip_code', values.zip_code);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('line', values.line);
    
    if (values.organization_id) {
      formData.append('organization_id', values.organization_id);
    }
    
    formData.append('is_active', member.is_active ? 'true' : 'false');

    updateMember({
      id: member.member_id,
      member: formData,
    });
  }, [member, fileImages, updateMember]);

  return {
    // States
    isUpdating,
    isUpdateSuccess,
    isUpdateError,
    
    // Functions
    handleSubmit,
    updateMember,
  };
};

