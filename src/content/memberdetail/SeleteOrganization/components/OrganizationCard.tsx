'use client';

import { FC, memo, useCallback } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  alpha,
  styled,
  Typography,
  useTheme,
  Stack,
} from '@mui/material';
import {
  AccountCircleOutlined,
  ContactSupportOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CancelOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';
import CountUp from 'react-countup';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ButtonPrimary from '@/components/ButtonPrimary';
import { MemberOrganization } from '@/model/member';
import { encrypt } from '@/utils/encryption';

const CardBorderBottom = styled(Box)(
  ({ theme }) => `
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${theme.palette.background.paper};
    border: 1px solid ${alpha(theme.colors.alpha.black[100], 0.08)};
    border-radius: 16px;
    box-shadow: 0 2px 12px ${alpha(theme.colors.alpha.black[100], 0.06)};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 24px ${alpha(theme.colors.alpha.black[100], 0.12)};
      border-color: ${alpha(theme.colors.primary.main, 0.3)};
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: ${theme.colors.gradients.primary};
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    &:hover::before {
      opacity: 1;
    }
  `,
);

const AvatarWrapperStyled = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};
    border: 3px solid ${alpha(theme.colors.primary.main, 0.1)};
    box-shadow: 0 4px 16px ${alpha(theme.colors.alpha.black[100], 0.1)};
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px ${alpha(theme.colors.alpha.black[100], 0.15)};
      border-color: ${alpha(theme.colors.primary.main, 0.3)};
    }
  `,
);

const InfoRow = styled(Box)(
  ({ theme }) => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    padding: ${theme.spacing(0.5, 0)};
    transition: all 0.2s ease;
    &:hover {
      padding-left: ${theme.spacing(0.5)};
      .info-icon {
        transform: scale(1.1);
      }
    }
  `,
);

type OrganizationWithRefer = MemberOrganization & {
  refer_id?: string;
};

interface OrganizationCardProps {
  organization: MemberOrganization;
  coinAmount: number;
}

const OrganizationCard: FC<OrganizationCardProps> = memo(({ organization, coinAmount }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleViewDetails = useCallback(() => {
    const encryptedId = encrypt(organization.organization_id.toString());
    router.push(`/profile/${encryptedId}`);
  }, [organization.organization_id, router]);

  const statusLabel = 'สถานะ';
  const isActive = organization.is_active;
  const referId = ((organization as OrganizationWithRefer).refer_id) || 'N/A';

  return (
    <CardBorderBottom sx={{ backgroundColor: isActive ? null : alpha(theme.colors.gray.main, 0.05) }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
            <Chip
              icon={
                isActive ? (
                  <CheckCircleOutlined sx={{ fontSize: '0.95rem !important' }} />
                ) : (
                  <CancelOutlined sx={{ fontSize: '0.95rem !important' }} />
                )
              }
              label={statusLabel}
              color={isActive ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', md: '0.75rem' }, height: 24 }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <AvatarWrapperStyled
              variant="rounded"
              sx={{ width: { xs: 56, sm: 60, md: 64 }, height: { xs: 56, sm: 60, md: 64 }, mb: 1.5 }}
              alt={organization.organization.company_name}
              src={organization.organization.company_logo ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${organization.organization.company_logo}` : ''}
            />
            <Typography variant="h4" color="primary" align="center"
              sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' }, fontWeight: 700, mb: 0.5 }}
            >
              {organization.organization.company_name}
            </Typography>
            <Typography variant="body2" color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' }, fontWeight: 600 }}
            >
              เข้าร่วมวันที่:{' '}
              {organization.joined_at ? format(new Date(organization.joined_at), 'dd/MM/yyyy') : 'N/A'}
            </Typography>
          </Box>

          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <InfoRow>
              <AccountCircleOutlined
                className="info-icon"
                sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: theme.palette.primary.main, transition: 'transform 0.2s ease' }}
              />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' }, color: 'text.secondary', flex: 1 }}>
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>User ID:</Box>{' '}
                {organization.user_id || 'N/A'}
              </Typography>
            </InfoRow>

            <InfoRow>
              <HomeOutlined
                className="info-icon"
                sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: theme.palette.primary.main, transition: 'transform 0.2s ease' }}
              />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' }, color: 'text.secondary', flex: 1 }}>
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>ไอดีห้อง:</Box>{' '}
                {organization.room_id || 'N/A'}
              </Typography>
            </InfoRow>

            <InfoRow>
                <ContactSupportOutlined
                  className="info-icon"
                  sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: theme.palette.primary.main, transition: 'transform 0.2s ease' }}
                />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' }, color: 'text.secondary', flex: 1 }}>
                  <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>ไอดีผู้แนะนำ:</Box>{' '}
                  {referId}
                </Typography>
            </InfoRow>
          </Stack>

          <Box sx={{ background: alpha(theme.colors.primary.main, 0.04), borderRadius: 1.5, p: { xs: 1.5, md: 2 }, border: `1px solid ${alpha(theme.colors.primary.main, 0.1)}` }}>
            <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' }, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              รายได้ที่ทำได้
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: { xs: 28, md: 30 }, height: { xs: 28, md: 30 }, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.palette.background.paper, borderRadius: 1, boxShadow: `0 2px 8px ${alpha(theme.colors.alpha.black[100], 0.08)}` }}>
                <Image src="/assets/svg/pg/PX_Coin.svg" width={30} height={30} alt="PX Coin" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }} />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' }, color: 'text.secondary', display: 'block', mb: 0.25 }}>
                  ยอด PX Coin
                </Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, fontWeight: 700, background: theme.colors.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                <CountUp end={coinAmount} duration={1.5} separator="," suffix="" />
              </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', gap: { xs: 1, md: 1.5 } }}>
          <ButtonPrimary fullWidth onClick={handleViewDetails} text="ดูข้อมูล" startIcon={<></>} />
        </Box>
      </Box>
    </CardBorderBottom>
  );
});

OrganizationCard.displayName = 'OrganizationCard';

export default OrganizationCard;

