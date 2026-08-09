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
  overviewDetailById: OverviewDetailListModel;

}
const BonusStudyDetails: FC<ResultsProps> = ({
  overviewDetailById,


}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();


  const totalBonus = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.my_progress 
  &&  overviewDetailById.data.vdo_data.my_progress?.filter(item => item.progress === 100)
  ?.reduce((sum, item) => sum + (item.vdo?.vdo_bonus || 0), 0) || 0; // Sum vdo_bonus values
  

  return (
    <>
      <CardBorderBottom
        style={{
          borderBlockColor: `${theme.colors.primary.main}`,

        }}

        sx={{
          // borderBottomColor: `${theme.colors.primary.main}`,

          textAlign: 'center'
        }}
      // onClick={() => {
      //   // router.push(`${GENERAL_DASHBOARD_PATH}/approval/forget`)
      // }} 
      >

        <Box
  p={{ xs: 2, md: 3 }}
        // display="flex"
        // alignItems="center"
        // justifyContent="space-between"
        >


          <Box>
            {/* Ranking Image */}


            {/* Product Info */}
            <UserBoxButton sx={{ cursor: 'default'}}>
              {/* Avatar Image */}
              <Avatar
                variant="rounded"
                alt={'reward'}
                src="/assets/svg/pg/golden-trophy.svg"
                sx={{
                  width: { xs: 40, md: 100 },
                  height: { xs: 40, md: 100 },
                }}
              />

              {/* Text Content */}
              <Box flex={1} ml={2} minWidth={200}>
                <UserBoxText>
                  <UserBoxLabelMain fontSize={{ xs: '0.8rem', md: '1rem' }} variant="h4">
                    โบนัสเรียนรู้
                  </UserBoxLabelMain>
                  <UserBoxDescriptionMain variant="body2" mt={2} >

                    <Box display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} >




                      <Typography mr={1}  variant="body1" gutterBottom>
                        <Image
                          src="/assets/svg/pg/star.svg"
                          width={0}
                          height={0}
                          className="w-3 h-3 sm:w-8 sm:h-8" 
                          alt="Wallte"
                        />{' '}

                      </Typography>
                      <Typography
                        variant='h4'
                        fontSize={{ xs: '0.7rem', md: '1rem' }}
                        style={{
                          background: `${theme.colors.gradients.primary}`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }} >
                        <CountUp

                          start={0}
                          end={parseInt(`${totalBonus}`)}
                          duration={3}
                          separator=","
                          delay={0}
                          decimals={0}
                          decimal=""
                          prefix=""
                          suffix=""
                        />

                      </Typography>
                      <Typography fontSize={{ xs: '0.7rem', md: '1rem' }} ml={1} variant="subtitle1" gutterBottom>

                        {t('Coin')}
                      </Typography>

                    </Box>

                  </UserBoxDescriptionMain>
                </UserBoxText>
              </Box>
            </UserBoxButton>
          </Box>




        </Box>
      </CardBorderBottom>
    </>
  );
}

export default BonusStudyDetails;
