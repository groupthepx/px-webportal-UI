import { FC } from 'react';
import { Box, Card, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import Image from "next/image";

// interface Props {

//   // SetMethodStatusAction: any
//   // setMemberDetail: any
//   // handleOpenDialog: any
//   // handleOpenDialogPayment  : any
// }


const WithdrawHistoryTable: FC<any> = ({

}) => {
  // const isMountedRef = useRefMounted();
  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Container
        sx={{
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
          maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
          padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
          margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
        }}

      >
        <Card>
          {(
            <>
              <TableContainer
                sx={{
                  overflowX: 'auto', // Enable horizontal scrolling
                  '@media (max-width: 600px)': {
                    maxWidth: '100vw'
                  }
                }}
              >
                <Table
                  sx={{
                    minWidth: { xs: '100%', sm: 650 }, // Minimum width for different breakpoints
                    '& .MuiTableCell-root': {
                      px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
                      py: { xs: 1, sm: 1.5, md: 2 }, // Responsive padding
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } // Responsive font size
                    }
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: 'transparent',
                        '& .MuiTableCell-head': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                          fontWeight: 'bold'
                        }
                      }}>
                      <TableCell align="left">#</TableCell>
                      <TableCell align="left">{t('วันเวลา')}</TableCell>
                      <TableCell align="left">{t('Profile')}</TableCell>
                      <TableCell align="left">{t('PX ID')}</TableCell>
                      <TableCell align="left">{t('User ID')}</TableCell>
                      <TableCell align="left">{t('Coin PX ที่ได้รับ')}</TableCell>
                      <TableCell align="left">{t('VJ Active')}</TableCell>
                      <TableCell align="left">{t('เข็ม JADE')}</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockProfiles.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell align="left">{row.datetime}</TableCell>
                        <TableCell align="left">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={row.profile.image}
                              alt={row.profile.name}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                marginRight: 8
                              }}
                            />
                            {row.profile.name}
                          </div>
                        </TableCell>
                        <TableCell align="left">{row.pxId}</TableCell>
                        <TableCell align="left">{row.userId}</TableCell>
                        <TableCell align="left">
                           <Box
                                    display="flex"
                                    alignItems="center" >
                                    <Box mr={1}>
                                      <Image src={'/assets/svg/pg/PX_Coin.svg'} width={24} height={24} alt={'PX Coin'} />
                                    </Box>
                                    {/* <Typography variant="subtitle1">
                                {label}:
                              </Typography> */}
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        ml: 1,
                                        background: `${theme.colors.gradients.primary}`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                      }}
                                    >
                                                                  <CountUp end={row.coinPx || 0} duration={1.5} separator="," suffix={''} />
                                    </Typography>
                                  </Box>

                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            variant="body2"
                            sx={{
                              color: row.vjActive ? theme.palette.success.main : theme.palette.error.main,
                              fontWeight: 'medium'
                            }}
                          >
                            {row.vjActive ? t('ใช้งานอยู่') : t('ไม่ใช้งาน')}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{row.jadePin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <Box p={2}>
                  <TablePagination
                    component={"div"}
                    count={roleAll && roleAll.pagination && roleAll.pagination.totalItems ? roleAll.pagination.totalItems : 0}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 25, 50, 100, 250]}
                  />
                </Box> */}
            </>
          )}
        </Card>

      </Container>
    </>
  );
}

export interface ProfileData {
  id: number;
  datetime: string;
  profile: {
    name: string;
    image: string;
  };
  pxId: string;
  userId: string;
  coinPx: number;
  vjActive: boolean;
  jadePin: number;
}

export const mockProfiles: ProfileData[] = [
  {
    id: 1,
    datetime: '2025-08-02 10:30:45',
    profile: {
      name: 'Sarah Wilson',
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    pxId: 'PX2025001',
    userId: 'USR45981',
    coinPx: 2500,
    vjActive: true,
    jadePin: 3
  },
  {
    id: 2,
    datetime: '2025-08-02 09:15:22',
    profile: {
      name: 'John Martinez',
      image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    pxId: 'PX2025002',
    userId: 'USR45982',
    coinPx: 1800,
    vjActive: true,
    jadePin: 2
  },
  {
    id: 3,
    datetime: '2025-08-01 15:45:30',
    profile: {
      name: 'Emma Thompson',
      image: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    pxId: 'PX2025003',
    userId: 'USR45983',
    coinPx: 3200,
    vjActive: false,
    jadePin: 4
  },
  {
    id: 4,
    datetime: '2025-08-01 14:20:15',
    profile: {
      name: 'Michael Chen',
      image: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    pxId: 'PX2025004',
    userId: 'USR45984',
    coinPx: 1500,
    vjActive: true,
    jadePin: 1
  },
  {
    id: 5,
    datetime: '2025-08-01 11:10:55',
    profile: {
      name: 'Lisa Anderson',
      image: 'https://randomuser.me/api/portraits/women/5.jpg'
    },
    pxId: 'PX2025005',
    userId: 'USR45985',
    coinPx: 2800,
    vjActive: true,
    jadePin: 3
  },
  {
    id: 6,
    datetime: '2025-07-31 16:35:40',
    profile: {
      name: 'David Kim',
      image: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    pxId: 'PX2025006',
    userId: 'USR45986',
    coinPx: 2100,
    vjActive: false,
    jadePin: 2
  },
  {
    id: 7,
    datetime: '2025-07-31 13:25:18',
    profile: {
      name: 'Sophie Turner',
      image: 'https://randomuser.me/api/portraits/women/7.jpg'
    },
    pxId: 'PX2025007',
    userId: 'USR45987',
    coinPx: 3500,
    vjActive: true,
    jadePin: 4
  },
  {
    id: 8,
    datetime: '2025-07-31 10:50:33',
    profile: {
      name: 'James Wilson',
      image: 'https://randomuser.me/api/portraits/men/8.jpg'
    },
    pxId: 'PX2025008',
    userId: 'USR45988',
    coinPx: 1900,
    vjActive: true,
    jadePin: 2
  },
  {
    id: 9,
    datetime: '2025-07-30 17:40:25',
    profile: {
      name: 'Emily Davis',
      image: 'https://randomuser.me/api/portraits/women/9.jpg'
    },
    pxId: 'PX2025009',
    userId: 'USR45989',
    coinPx: 2700,
    vjActive: false,
    jadePin: 3
  },
  {
    id: 10,
    datetime: '2025-07-30 14:15:50',
    profile: {
      name: 'Robert Lee',
      image: 'https://randomuser.me/api/portraits/men/10.jpg'
    },
    pxId: 'PX2025010',
    userId: 'USR45990',
    coinPx: 2300,
    vjActive: true,
    jadePin: 2
  }
];

export default WithdrawHistoryTable;
