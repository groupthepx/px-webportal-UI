'use client';

import { FC, useMemo } from 'react';
import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SafeCountUp from '@/components/SafeCountUp';
import Image from 'next/image';
import { ReferRewardHistoryDetail } from '@/model/refer_friend';

interface Props {
  memberReferDetail: ReferRewardHistoryDetail[];
}

const BASE_UPLOADS = process.env.NEXT_PUBLIC_BASE_UPLOADS ?? '';

const pad2 = (n: number) => String(n).padStart(2, '0');
const formatDateTime = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

const safeProfileUrl = (path?: string) => {
  if (!path) return '/assets/images/default-avatar.png';
  if (path.startsWith('http')) return path;
  return BASE_UPLOADS ? `${BASE_UPLOADS}/${path}` : path;
};

/**
 * Parse income level from refer_bonus_detail
 * เช่น "Refer bonus (future total 844468) += 50 from fe7c3250-daed-48cb-b3c5-6c883bc47d45"
 * 
 * ถ้ามี field income_level ใน response ใช้ตรงๆ
 * ถ้าไม่มี พยายาม parse จาก detail หรือใช้ default
 */
const parseIncomeLevel = (item: ReferRewardHistoryDetail): number => {
  // ถ้า API ส่ง income_level มาตรงๆ
  if (item.income_level) {
    return item.income_level;
  }
  
  // ลอง parse จาก refer_bonus_detail (ถ้ามี pattern บอก level)
  const detail = item.refer_bonus_detail || '';
  
  // Pattern เช่น "Level 2" หรือ "level2" หรือ "ระดับ 2"
  const levelMatch = detail.match(/(?:level|ระดับ)\s*(\d+)/i);
  if (levelMatch) {
    return parseInt(levelMatch[1], 10);
  }
  
  // Default: Level 1 (รายได้ตรงจากคนที่แนะนำโดยตรง)
  return 1;
};

const BonusFriendsHistoryTable: FC<Props> = ({ memberReferDetail }) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();

  // เตรียม rows จาก API - ใช้ข้อมูลจาก referred_employee (คนที่เราแนะนำ)
  const rows = useMemo(() => {
    return (memberReferDetail ?? []).map((item, idx) => {
      const referred = item.referred_employee;
      
      // ข้อมูลของคนที่เราแนะนำ (ทำให้เราได้ bonus)
      const name: string = referred?.nick_name || referred?.full_name || '-';
      const profileImg: string = safeProfileUrl(referred?.profile);
      const pxId: string = referred?.user_px || '-';
      const memberId: string = referred?.member_id || '-';
      const coinPx: number = Number(item.refer_bonus ?? 0);
      const incomeLevel: number = parseIncomeLevel(item);
      
      return {
        idx: idx + 1,
        datetime: formatDateTime(item.created_at),
        name,
        profileImg,
        pxId,
        memberId,
        coinPx,
        incomeLevel,
        futureTotal: item.future_total || 0,
      };
    });
  }, [memberReferDetail]);

  return (
    <Container
      sx={{
        width: { xs: '100%', sm: 'auto' },
        maxWidth: 'lg',
        padding: { xs: 0, md: '0px' },
        margin: { xs: 0, sm: 'auto' },
      }}
    >
      <Card>
        <TableContainer
          sx={{
            overflowX: 'auto',
            '@media (max-width: 600px)': { maxWidth: '100vw' },
          }}
        >
          <Table
            sx={{
              minWidth: { xs: '100%', sm: 750 },
              '& .MuiTableCell-root': {
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'transparent',
                  '& .MuiTableCell-head': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    fontWeight: 'bold',
                  },
                }}
              >
                <TableCell className="whitespace-nowrap" align="left">
                  #
                </TableCell>
                <TableCell className="whitespace-nowrap" align="left">
                  {t('วันเวลา')}
                </TableCell>
                <TableCell className="whitespace-nowrap" align="left">
                  {t('โปรไฟล์คนที่แนะนำ')}
                </TableCell>
                <TableCell className="whitespace-nowrap" align="left">
                  {t('PX ID')}
                </TableCell>
                <TableCell className="whitespace-nowrap" align="left">
                  {t('Coin PX ที่ได้รับ')}
                </TableCell>
                {/* <TableCell className="whitespace-nowrap" align="center">
                  {t('ระดับรายได้')}
                </TableCell> */}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('ไม่พบข้อมูล')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={`${row.idx}-${row.memberId}-${row.pxId}`}>
                    <TableCell align="left">{row.idx}</TableCell>
                    <TableCell align="left">{row.datetime}</TableCell>

                    <TableCell align="left">
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          src={row.profileImg}
                          alt={row.name}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            marginRight: 1,
                            objectFit: 'cover',
                            border: '2px solid',
                            borderColor: 'divider',
                          }}
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/assets/images/default-avatar.png';
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {row.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align="left">
                      <Typography variant="body2" fontWeight={500} color="primary">
                        {row.pxId}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>
                          <Image
                            src="/assets/svg/pg/PX_Coin.svg"
                            width={24}
                            height={24}
                            alt="PX Coin"
                          />
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            ml: 1,
                            background: `${theme.colors.gradients.primary}`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          <SafeCountUp end={row.coinPx || 0} duration={1.0} separator="," />
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* <TableCell align="center">
                      <Chip
                        label={`ระดับ ${row.incomeLevel}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          backgroundColor:
                            row.incomeLevel === 1
                              ? 'rgba(46, 125, 50, 0.1)'
                              : 'rgba(255, 152, 0, 0.1)',
                          color:
                            row.incomeLevel === 1
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                          border: '1px solid',
                          borderColor:
                            row.incomeLevel === 1
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                        }}
                      />
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

export default BonusFriendsHistoryTable;
