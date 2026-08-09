import {
  Typography,
  CardContent,
  Card,
  Box,
  Button,
  useTheme,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { FC, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';

import Image from "next/image";
import CountUp from 'react-countup';
import { MemberDetailModel } from '@/model/member';
interface VJStarLiveMemberProps {

  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel
  ParamsId : string;
  
}

const UnlockStarLiveMember: FC<VJStarLiveMemberProps> = ({
  overviewDetailById,
  memberById,
  ParamsId

}) => {
  const theme = useTheme();


  // const [vdoDeatil, setVdoDeatil] = useState<AllVdo | null>(null);





  const missionVideo = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.all_vdo || null
  const missionsVdoDataMyProgress = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.my_progress || []


  const vj_Active_Status = overviewDetailById && overviewDetailById.data && overviewDetailById.data.VJ_Active
  const sapphipe_Status = overviewDetailById && overviewDetailById.data && overviewDetailById.data.SAPPHIPE


  const memberOrganizationDetail = memberById && memberById.member_organization ? 
  memberById.member_organization.find( (item: any) => item.organization_id === ParamsId) : null;

  // console.log("missionVideo", missionVideo)
  // console.log("missionsVdoDataMyProgress", missionsVdoDataMyProgress)

   const newMission = [
    {
      vdo_id: "1",
      vdo_title: "เข้ากลุ่ม VJ",
      url: "/assets/svg/pg/vj_group.svg",
      key: "group_vj",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.group_vj ? true : false,
    },
    {
      vdo_id: "2",
      vdo_title: "ประชุมนโยบายแอป",
      url: "/assets/svg/pg/policy_app.svg",
      key: "meeting_policy_app",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.meeting_policy_app ? true : false,
    },
    {
      vdo_id: "3",
      vdo_title: "ประชุมนโยบาย PX",
      url: "/assets/svg/pg/policy_meeting.svg",
      key: "meeting_policy_px",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.meeting_policy_px ? true : false,
    },
    {
      vdo_id: "4",
      vdo_title: "ฝืก 10 Step",
      url: "/assets/svg/pg/10_step.svg",
      key: "train_ten_step",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.train_ten_step ? true : false,
    },
    {
      vdo_id: "5",
      vdo_title: "Add Line VJ",
      url: "/assets/svg/pg/add_line.svg",
      key: "add_line_vj",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.add_line_vj ? true : false,
    },
    {
      vdo_id: "6",
      vdo_title: "Bonus Time ",
      url: "/assets/svg/pg/bonus_time.svg",
      key: "bonus_time",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.bonus_time ? true : false,
    },
    {
      vdo_id: "7",
      vdo_title: "VJ Active",
      url: memberOrganizationDetail && memberOrganizationDetail.vj_active  ? "/assets/image/unlock/dj_active_unlock.png" : "/assets/image/unlock/dj_active_lock.png",
      key: "vj_active",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.vj_active ? true : false,
    },
    {
      vdo_id: "8",
      vdo_title: "Sapphipe",
      url: memberOrganizationDetail && memberOrganizationDetail.sapphipe  ? "/assets/image/unlock/sapphipe_unlock.png" : "/assets/image/unlock/sapphipe_lock.png",
      key: "sapphipe",
      is_unlock: memberOrganizationDetail && memberOrganizationDetail.sapphipe ? true : false,
    }
  ];

  // console.log("newMission", newMission)
  return (

    <>
      <Card
        sx={{

          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Typography

          p={1}
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, mb: { xs: 0, md: 2 } }}
        >
          ปลดล็อค VJ Star Live
        </Typography>

        {/* Mission Section */}
        <CardContent>
          <div className="grid h-full grid-cols-12 gap-2">
            {missionVideo && newMission.map(function (mission: any, index: number) {

              return <Box
                className="h-full md:col-span-3 col-span-3"
                sx={{
                  alignItems: { xs: 'center', md: 'center' },
                  justifyContent: { xs: 'start', md: 'start' },
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor:
                    mission.is_unlock
                      ? '#fff5eb'
                      : '#f5f5f5',
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 1,
                  textAlign: 'center',
                  boxShadow: mission.is_unlock ? '0px 2px 6px rgba(0, 0, 0, 0.1)' : 'none',

                }}

                key={mission.vdo_id}
              >
                <Box

                >
                  <Typography noWrap fontWeight="bold" fontSize={{ xs: '0.5rem', md: '1rem' }} >
                    {mission.vdo_title}
                  </Typography>

                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    mt={1} mb={1}

                  >
                    <Avatar
                      variant="rounded"
                      alt="reward"
                      src={
                        !mission.is_unlock
                          ? `${mission.url}`
                          : `${mission.url}`
                      }
                      sx={{
                        width: { xs: 60, md: 150 },
                        height: { xs: 60, md: 150 },
                      }}
                    />

                  </Box>

                  <Box mt={1} mb={1}

                  >
                    <Typography
                      fontSize={{
                        xs: "0.5rem",
                        md: "0.9rem"
                      }}
                      fontWeight="bold"
                      sx={{
                        color:
                          mission.is_unlock
                            ? 'green'
                            : 'gray',
                      }}
                    >

                      {mission.is_unlock
                        ? 'สำเร็จ'
                        : 'ยังไม่ได้รับอนุญาต'}
                    </Typography>
                  </Box>

                  {/* {!mission.is_unlock && (
                    <Box
                      sx={{
                        p: { xs: 1.5, md: 2 },
                      }} >
                      <Button
                        variant="contained"
                        onClick={() => {
                          //  console.log('missionsAllProgress',missionsAllProgress);
                          // setVdoDeatil(mission)
                          // handleActionOpen()
                        }}
                        fullWidth
                        sx={{
                          mt: 1,
                          backgroundColor: '#FF9800',
                          color: 'white',
                          // borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#E68900',
                          },
                        }}
                      >
                        Unlock
                      </Button>
                    </Box>
                  )} */}


                </Box>

              </Box>


            })}

          </div>
        </CardContent>
      </Card >
      {/* <DialogCustomAll
        textHeader='คุณต้องการ Unlock วีดีโอนี้หรือไม่?'
        textTitle=' หากท่านได้ทำการ Unlock นี้ จะทำให้ VJ ดูวีดีโอได้ !'
        onClickClose={
          () => {
            handleActionClose()
          }
        }
        onClickCompleted={
          () => {


            if (vdoDeatil && vdoDeatil?.vdo_id && memberParamsId) {

              postUnlockComission({
                unlock: {
                  member_id: `${memberParamsId}`,
                  vdo_id: `${vdoDeatil?.vdo_id}`
                }
              })


            }

          }
        }
        openConfirmDelete={openAction}
        btnConfirmText='Unlock !'
        btnCloseText='เปรี่ยนใจ!'

      /> */}
    </>
  );
};

export default UnlockStarLiveMember;
