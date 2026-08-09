import {

  Typography,
  Card,
  Box,
  CardActionArea,
  styled,
  useTheme,
  Dialog,
  DialogTitle,
  IconButton,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import { ArrowForwardOutlined, Close, MoveToInboxOutlined } from '@mui/icons-material';
import CountUp from 'react-countup';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';

import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import { MemberDetailModel } from '@/model/member';
import { useGetMissionByOrganizationsByIdQuery } from '@/lib/features/organization';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);

interface Props {

  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel
  ParamsId : string
}
const PositionDetails: FC<Props> = ({
  overviewDetailById,
  memberById,
  ParamsId

}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();



  const [openPreView, setOpenPreView] = useState(false);


  const handleOpenPreView = () => {
    setOpenPreView(true);
  };


  const handleClosePreView = () => {
    setOpenPreView(false);
  };


  const collectMissions = overviewDetailById && overviewDetailById.data && overviewDetailById.data.collect_missions || null;



  const collectMissionsTotalBonus = collectMissions && collectMissions.reduce((sum, item) => {
    return sum + (item.collect_bonus_position_mission || 0);
  }, 0);
  // bonus_position_mission

  // const totalCoins = 5;

  const PATH_POSITION = '/assets/image/position';


  const { data: mission } = useGetMissionByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );


  const data = mission && mission.data;

  const sortedData = data && [...data].sort((a, b) => a.amount_mission - b.amount_mission);
  // console.log("sortedData", sortedData);


  const missionData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.mission_coin_up_data;

  const myAmount = missionData?.my_amount || 0;


  // Create a new mission list, extracting necessary properties
  const newMission = sortedData?.slice(0, 20).map((item: any, index: number) => ({
    name: item.name_mission,
    id: item.mission_id,
    title: item.name_mission,
    url_active: item.icon_img ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.icon_img}` : '',
    url_unactive: item.icon_img ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.icon_img}` : '',
    coin: item.amount_mission,
    bonus_mission: item.bonus_mission,
    bonus_position_mission: item.bonus_position_mission,
  })) || [];


  const maxAmountEnd = data ? Math.max(...data.map((item: any) => item.amount_mission)) : 0;

  let filteredMilestones: any[] = [];
  let coinData = 0;


  if (myAmount > maxAmountEnd) {



    const data = [...newMission]
      .sort((a, b) => b.coin - a.coin) // Descending sort
      .slice(0, 5);

    filteredMilestones = data && data.sort((a, b) => a.coin - b.coin);


    const maxPreviou = data && data.length > 0
      ? data.reduce((max: any, item: any) => item.amount_mission > max.amount_mission ? item : max)
      : null;


    coinData = myAmount && maxPreviou && maxPreviou.percent_reward && (maxPreviou.bonus_position_mission) || 0;


  } else {
    const previousMilestone1 = newMission.filter((item: any) => item.coin <= myAmount) || [];
    const nextMilestone1 = newMission.filter((item: any) => item.coin > myAmount) || [];
    const beforeItems = previousMilestone1.slice(nextMilestone1.length === 1 ? -4 : -3, -1); // Get the last two items before the last one
    const currentItem = previousMilestone1.length > 0 ? previousMilestone1.slice(-1) : [];
    const afterItems = nextMilestone1.slice(0, 2);


    const previousMilestoneTotal = data && data.filter((item: any) => item.amount_mission <= myAmount) || [];
    const maxPreviousMilestone = previousMilestoneTotal.length > 0
      ? previousMilestoneTotal.reduce((max: any, item: any) => item.amount_mission > max.amount_mission ? item : max)
      : null;


    coinData = myAmount && maxPreviousMilestone && (maxPreviousMilestone.bonus_position_mission) || 0;



    let combined = [...beforeItems, ...currentItem, ...afterItems];

    if (combined.length < 5) {
      const missing = 5 - combined.length;

      // Filter out duplicates from 'moreBefore' that are already in 'combined'
      const moreBefore = previousMilestone1
        .slice(Math.max(0, previousMilestone1.length - beforeItems.length - missing), previousMilestone1.length - beforeItems.length)
        .filter((item: any) => !combined.some(combinedItem => combinedItem.id === item.id)); // Check for duplicates based on 'id'

      // Filter out duplicates from 'moreAfter' that are already in 'combined'
      const moreAfter = nextMilestone1
        .slice(afterItems.length, afterItems.length + missing)
        .filter((item: any) => !combined.some(combinedItem => combinedItem.id === item.id)); // Check for duplicates based on 'id'

      // Combine and ensure that only unique items are included
      combined = [...moreBefore, ...combined, ...moreAfter].slice(-5);
    }


    filteredMilestones = combined.sort((a, b) => a.coin - b.coin);

  }





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
          p={{
            xs: 1,
            md: 3
          }}
        // display="flex"
        // alignItems="center"
        // justifyContent="space-between"
        >
          <Box mb={{
            xs: 0,
            md: 2
          }} alignItems="center" textAlign={"center"}>
            <Typography variant="h4" gutterBottom>
              {t('ตำแหน่งสะสม')}
            </Typography>
          </Box>
          {/* <Box mt={2} display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} > */}

          {/* Map over the total coins, displaying a colored coin if the index is less than CoinCout */}


          <Grid
            sx={{
              px: { md: 0, xs: 0 },
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          // display={'flex'}
          >
          
            {collectMissions
              &&
              collectMissions
                .slice(0, 5)
                .map((mission: any, index: number) => {

                  const newMissionItems = newMission.find((item: any) => item.id === mission.mission_id);

                  return (
                    <Grid key={index} size={2.4}>


                      {newMissionItems &&
                        <Image
                          src={newMissionItems ? newMissionItems.url_active : ''}
                          width={100}
                          height={100}
                          style={{ maxWidth: '100%', height: 'auto' }}
                          alt={mission.collect_mission_id}
                        />

                      }
                      <Typography
                        sx={{
                          fontSize: {
                            xs: '0.6rem',
                            sm: '0.7rem',
                            md: '0.7rem',

                          },
                          textAlign: 'center',
                        }}
                        variant="h4"
                        mt={1}
                      >
                        {mission.collect_name_mission}
                      </Typography>
                      {/* <Typography
                    sx={{
                      fontSize: {
                        xs: '0.6rem',  // small phones
                        sm: '0.7rem',  // tablets
                        md: '0.8rem',  // desktops
                      },
                      mt: 1,
                      fontWeight: 500
                    }}
                    variant="body2" mt={1}>
                    {mission.coin}
               
                  </Typography> */}
                    </Grid>
                  )
                })}

            <Grid size={12} mt={2}   >
              <Box mt={{
                xs: 0,
                md: 2
              }} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
                <Typography mr={1} variant="body1" gutterBottom>
                  <Image
                    src="/assets/svg/pg/star.svg"
                    width={0}
                    height={0}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    alt="Wallte"
                  />{' '}

                </Typography>
                <Box display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} >

                  <Typography
                    variant='h4'
                    fontSize={{ xs: '0.8rem', md: '1rem' }}
                    style={{
                      background: `${theme.colors.gradients.primary}`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }} >
                    <CountUp
                      style={{
                        marginLeft: 5
                      }}
                      start={0}
                      end={collectMissionsTotalBonus}
                      duration={3}
                      separator=""
                      delay={0}
                      decimals={0}
                      decimal=""
                      prefix=""
                      suffix=" Bonus Coin"
                    />

                  </Typography>


                </Box>


              </Box>

            </Grid>
            <Grid size={12} mt={{
              xs: 0,
              md: 2
            }}   >

              <Divider style={{
                backgroundColor: `${theme.colors.primary.main}`,

              }} sx={{
                my: {
                  xs: 1,
                  md: 2
                }
              }} />

              <Box display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >


                <Box
                  onClick={
                    () => {
                      // const encryptedId = item.member_id ? encrypt(item.member_id) : '';
                      // router.push(`${MAMBER_PATH}/detail/${encryptedId}`)
                      handleOpenPreView();
                    }
                  }
                  sx={{
                    cursor: 'pointer',
                    ":hover": {
                      color: theme.colors.primary.main
                    }


                  }}
                ><Typography fontSize={{ xs: '0.8rem', md: '1rem' }} variant='h4' color='primary'  >  ดูทั้งหมด  </Typography></Box>



              </Box>
            </Grid>

          </Grid>





        </Box>
      </CardBorderBottom>


      <>


        <Dialog fullWidth maxWidth="md" open={openPreView} onClose={handleClosePreView}>
          <DialogTitle>
            <Typography variant="h3" color='primary' gutterBottom sx={{
              textAlign: 'center',
            }} >
              {'ตำแหน่งสะสม'}
            </Typography>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClosePreView}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <Close />
          </IconButton>

          <Box>

            <Grid
              sx={{
                px: 4,
                p: 5
              }}
              container
              direction="row"
              justifyContent="left"
              alignItems="left"
              spacing={4}
            // display={'flex'}
            >

              {collectMissions && collectMissions.map((mission: any, index: number) => {

                const newMissionItems = newMission.find((item: any) => item.id === mission.mission_id);



                return (
                  <Grid key={index} size={{
                    md: 2,
                    sm: 4,
                    xs: 6
                  }}>
                    <Box
                      sx={{
                        padding: 2, // Consistent padding inside card
                        height: '100%', // Make all cards the same height
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >

                      {newMissionItems &&
                        <Image
                          src={newMissionItems ? newMissionItems.url_active : ''}
                          width={100}
                          height={100}
                          style={{ maxWidth: '100%', height: 'auto' }}
                          alt={mission.collect_mission_id}
                        />

                      }

                      {/* <Image
                        src={myAmount >= mission.coin ? mission.url_active : mission.url_unactive}
                        width={100}
                        height={100}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        alt={mission.title}
                      /> */}
                      <Typography
                        sx={{
                          fontSize: {
                            xs: '0.6rem',
                            sm: '0.7rem',
                            md: '0.8rem',
                          },
                          textAlign: 'center',
                        }}
                        variant="h4"
                        mt={1}
                      >
                        {mission.collect_name_mission}
                      </Typography>
                      {/* <Typography
                      sx={{
                        fontSize: {
                          xs: '0.6rem',
                          sm: '0.7rem',
                          md: '0.8rem',
                        },
                        textAlign: 'center',
                      }}
                      color="primary"
                      variant="h4"
                      mt={1}
                    >
                      {mission.coin ? mission.coin.toLocaleString() : 0}
                    </Typography> */}
                    </Box>
                  </Grid>
                )
              }
              )}


            </Grid>



          </Box>
          {/* <InformationMember member={memberDetail} setOpenActionEdit={setOpenActionEdit} /> */}

        </Dialog>

      </>
    </>
  );
}

export default PositionDetails;
