import {

  Typography,
  Card,
  Box,
  CardActionArea,
  styled,
  useTheme,
  Button,
  alpha,
  Avatar,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Image from "next/image";
import { MemberDetailModel } from '@/model/member';
import CountUp from 'react-countup';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { useGetRankBonusByOrganizationsByIdQuery } from '@/lib/features/organization';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);


const UserBoxButton = styled(Button)(
  ({ theme }) => `

  padding: ${theme.spacing(0, 1)};
  color: ${theme.colors.alpha.trueWhite[50]};
  background-color: ${theme.colors.alpha.white[10]};
  border-radius: ${theme.general.borderRadiusLg};


  .MuiSvgIcon-root {
    transition: ${theme.transitions.create(['color'])};
    font-size: ${theme.typography.pxToRem(24)};
    color: ${theme.colors.alpha.trueWhite[50]};
  }

  .MuiAvatar-root {
    border-radius: ${theme.general.borderRadiusLg};
    width: 60px;
    height: 60px;
  }

  &.active,
  &:hover {
    background-color: ${alpha(theme.colors.alpha.white[30], 0.2)};

    .MuiSvgIcon-root {
      color: ${theme.colors.alpha.trueWhite[100]};
    }
  }

  .MuiButton-label {
    justify-content: flex-start;
  }

`
);



const UserBoxDescriptionMain = styled(Typography)(
  ({ theme }) => `
        color: ${theme.colors.gray.main};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabelMain = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    display: block;
    color: ${theme.colors.black.main};
`);



interface ResultsProps {
  member: MemberDetailModel | null
  overviewDetailById: OverviewDetailListModel;
  ParamsId : string;

}
const VJRankDetails: FC<ResultsProps> = ({
  member,
  overviewDetailById,
  ParamsId


}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();


  const { data: rankBonus } = useGetRankBonusByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );
  const rankBonusData = rankBonus && rankBonus.data || null;

  
  const yourRank = overviewDetailById && overviewDetailById.data && overviewDetailById.data.My_Rank || []

  // Sort yourRank array by member_amount in descending order
  const sortedRank = [...yourRank].sort((a, b) => {
    const amountA = a.member_amount && a.member_amount[0]?.amount || 0;
    const amountB = b.member_amount && b.member_amount[0]?.amount || 0;
    return amountB - amountA;
  });


  return (
    <>
      <CardBorderBottom
        style={{
          borderBlockColor: `${theme.colors.primary.main}`,
        }}
        sx={{
          textAlign: 'center'
        }}
      >

        <Box
          p={3}
        >
          <Box alignItems="center" textAlign={"center"}>
            <Typography variant="h4" gutterBottom>
              {t('การแข่งขันการจัดอันดับ ปัจจุบัน')}
            </Typography>

          </Box>


          {sortedRank && sortedRank.length > 0 && (
            sortedRank.map((item, index) => {

              const rankBonusDetail = rankBonusData && rankBonusData.find((data: any) => data.number_rank === index + 1);

              return (
                <Box key={item.member_id} display="flex" alignItems="center" gap={2} width="100%">
                  <Box width={100} height={100} display="flex" alignItems="center" justifyContent="center" mr={3}>
                    {index === 0 ?
                      <Image
                        src="/assets/svg/pg/RankFirst.svg"
                        width={100}
                        height={100}
                        alt="bronze"
                      /> :
                      index === 1 ?
                        <Image
                          src="/assets/svg/pg/RankSecond.svg"
                          width={100}
                          height={100}
                          alt="bronze"
                        /> :
                        index === 2 ?
                          <Image
                            src="/assets/svg/pg/RankThird.svg"
                            width={100}
                            height={100}
                            alt="bronze"
                          /> :
                          <UserBoxLabelMain variant="h2">
                            <Typography color='primary' ml={1} variant="h4" gutterBottom>
                              {index + 1}
                            </Typography>
                          </UserBoxLabelMain>
                    }
                  </Box>


                  <UserBoxButton sx={{ cursor: 'default', width: "100%", display: "flex", alignItems: "center" }}>

                    <Avatar
                      variant="rounded"
                      alt={item?.member_id}
                      src={item && item.profile ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + item.profile : ''}
                      sx={{ width: 100, height: 100 }}
                    />

                    <Box flex={1} ml={2} minWidth={200}>
                      <UserBoxText>
                        <UserBoxLabelMain variant="h4">
                          {item?.nick_name}
                        </UserBoxLabelMain>
                        <UserBoxDescriptionMain variant="body2">

                          <Box display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} >

                            <Typography mr={1} variant="subtitle1" gutterBottom>

                              ยอด VJ
                            </Typography>

                            <Typography
                              variant='h4'
                              style={{
                                background: `${theme.colors.gradients.primary}`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }} >
                              <CountUp

                                start={0}
                                 end={item && item?.member_amount && item?.member_amount.length > 0 ? (item?.member_amount[0]?.amount) : 0}
                                duration={3}
                                separator=","
                                delay={0}
                                decimals={0}
                                decimal=""
                                prefix=""
                                suffix=""
                              />

                            </Typography>


                          </Box >

                          {rankBonusDetail &&
                            <Typography color='primary' variant="subtitle1" gutterBottom>
                              ได้รับโบนัส {rankBonusDetail.bonus_rank ? rankBonusDetail.bonus_rank.toLocaleString() : 0} PX Coin
                            </Typography>}


                        </UserBoxDescriptionMain>
                      </UserBoxText>
                    </Box>
                  </UserBoxButton>
                </Box>

              )
            }))
          }
          {/* <Divider style={{
            backgroundColor: `${theme.colors.primary.main}`,

          }} sx={{ my: 2 }} /> */}


          {/* <Box display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} >

            <Typography ml={1} variant="subtitle1" gutterBottom>
              {t('คุญอยู่อันดับที่')}
            </Typography>
            <Typography
              ml={1}
              variant='h4'
              style={{
                background: `${theme.colors.gradients.primary}`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} >
              <CountUp

                start={0}
                end={parseInt(`${myRank + 1}`)}
                duration={3}
                separator=""
                delay={0}
                decimals={0}
                decimal=""
                prefix=""
                suffix=""
              />

            </Typography>

            <Typography ml={1} variant="h4" gutterBottom>

              |
            </Typography>

            <Typography mr={1} variant="body1" gutterBottom>
              <Image
                src="/assets/svg/pg/star.svg"
                width={25}
                height={25}
                alt="Wallte"
              />{' '}

            </Typography>
            <Typography
              variant='h4'
              style={{
                background: `${theme.colors.gradients.primary}`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} >
              <CountUp

                start={0}
                end={myRankData && myRankData.length > 0 ? (myRankData[0].amount) : 0}
                duration={3}
                separator=""
                delay={0}
                decimals={0}
                decimal=""
                prefix=""
                suffix=""
              />

            </Typography>
            <Typography ml={1} variant="subtitle1" gutterBottom>

              {t('Bonus Coin')}
            </Typography>

          </Box > */}
        </Box>
      </CardBorderBottom >
    </>
  );
}

export default VJRankDetails;
