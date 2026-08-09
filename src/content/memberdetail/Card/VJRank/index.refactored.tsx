/**
 * VJ Rank Component (Refactored)
 * 
 * ปรับปรุง Performance:
 * - ใช้ custom hook สำหรับ sorting
 * - แยก RankItem เป็น component ย่อย
 * - เพิ่ม memoization
 * - ลด inline styles
 */

import {
  Typography,
  Box,
  Avatar,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, memo } from 'react';
import Image from 'next/image';
import CountUp from 'react-countup';
import { MemberDetailModel } from '@/model/member';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { useGetRankBonusByOrganizationsByIdQuery } from '@/lib/features/organization';
import {
  CardBorderBottom,
  UserBoxButton,
  UserBoxText,
  UserBoxLabelMain,
  UserBoxDescriptionMain,
} from '../shared/StyledComponents';
import { useRankSorting } from '../shared/hooks';

// Rank medal images mapping
const RANK_MEDALS = [
  '/assets/svg/pg/RankFirst.svg',
  '/assets/svg/pg/RankSecond.svg',
  '/assets/svg/pg/RankThird.svg',
];

interface RankItemProps {
  item: any;
  index: number;
  rankBonusDetail: any;
}

// Separate component for rank item
const RankItem: FC<RankItemProps> = memo(({ item, index, rankBonusDetail }) => {
  const theme = useTheme();

  const profileImageUrl = item?.profile
    ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.profile}`
    : '';

  const amount = item?.member_amount?.[0]?.amount ?? 0;

  return (
    <Box display="flex" alignItems="center" gap={2} width="100%">
      {/* Rank Number/Medal */}
      <Box
        width={100}
        height={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mr={3}
      >
        {index < 3 ? (
          <Image
            src={RANK_MEDALS[index]}
            width={100}
            height={100}
            alt={`rank-${index + 1}`}
          />
        ) : (
          <UserBoxLabelMain variant="h2">
            <Typography color="primary" ml={1} variant="h4" gutterBottom>
              {index + 1}
            </Typography>
          </UserBoxLabelMain>
        )}
      </Box>

      {/* User Info */}
      <UserBoxButton
        sx={{
          cursor: 'default',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          variant="rounded"
          alt={item?.member_id}
          src={profileImageUrl}
          sx={{ width: 100, height: 100 }}
        />

        <Box flex={1} ml={2} minWidth={200}>
          <UserBoxText>
            <UserBoxLabelMain variant="h4">{item?.nick_name}</UserBoxLabelMain>

            <UserBoxDescriptionMain variant="body2">
              <Box display="flex" sx={{ justifyContent: 'left', alignItems: 'center' }}>
                <Typography mr={1} variant="subtitle1" gutterBottom>
                  ยอด VJ
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    background: `${theme.colors.gradients.primary}`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <CountUp
                    start={0}
                    end={amount}
                    duration={3}
                    separator=","
                    delay={0}
                  />
                </Typography>
              </Box>

              {rankBonusDetail && (
                <Typography color="primary" variant="subtitle1" gutterBottom>
                  ได้รับโบนัส {rankBonusDetail.bonus_rank?.toLocaleString() ?? 0} PX
                  Coin
                </Typography>
              )}
            </UserBoxDescriptionMain>
          </UserBoxText>
        </Box>
      </UserBoxButton>
    </Box>
  );
});

RankItem.displayName = 'RankItem';

interface ResultsProps {
  member: MemberDetailModel | null;
  overviewDetailById: OverviewDetailListModel;
  ParamsId: string;
}

const VJRankDetails: FC<ResultsProps> = memo(
  ({ member, overviewDetailById, ParamsId }) => {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();

    // Fetch rank bonus data
    const { data: rankBonus } = useGetRankBonusByOrganizationsByIdQuery(
      { id: `${ParamsId}` },
      { skip: ParamsId === '0' }
    );
    const rankBonusData = rankBonus?.data ?? null;

    // Get and sort rank data using custom hook
    const yourRank = overviewDetailById?.data?.My_Rank ?? [];
    const sortedRank = useRankSorting(yourRank);

    return (
      <CardBorderBottom
        sx={{
          borderBlockColor: theme.palette.primary.main,
          textAlign: 'center',
        }}
      >
        <Box p={3}>
          <Box alignItems="center" textAlign="center">
            <Typography variant="h4" gutterBottom>
              {t('การแข่งขันการจัดอันดับ ปัจจุบัน')}
            </Typography>
          </Box>

          {sortedRank.length > 0 &&
            sortedRank.map((item, index) => {
              const rankBonusDetail = rankBonusData?.find(
                (data: any) => data.number_rank === index + 1
              );

              return (
                <RankItem
                  key={item.member_id}
                  item={item}
                  index={index}
                  rankBonusDetail={rankBonusDetail}
                />
              );
            })}
        </Box>
      </CardBorderBottom>
    );
  }
);

VJRankDetails.displayName = 'VJRankDetails';

export default VJRankDetails;

