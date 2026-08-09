'use client'
import { Box, Button, Card, Container, IconButton, ListItem, Skeleton, Stack, styled, Tooltip, Typography, useTheme } from '@mui/material';
import Logo from '../Logo';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { LOGO_FACKBOOK, LOGO_INSTAGRAM, LOGO_LINE_WHITE, LOGO_TEXT_WHITE, LOGO_TIKTOK, LOGO_YOUTUBE } from '@/constants/svg';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Android as AndroidIcon, Apple as AppleIcon, LocalPhoneOutlined } from '@mui/icons-material';
import { useGetContactListAllQuery } from '@/lib/features/contact';
import { useSession } from 'next-auth/react';



const FooterWrapper = styled(Box)(
  ({ theme }) => `
     position: relative;
    width: 100%;
    padding: ${theme.spacing(2, 8)};
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center; // Center content horizontally
    align-items: center; // Center content vertically
    flex-shrink: 0; // Prevent footer from shrinking


`
);
const OverviewWrapper = styled(Card)(
  ({ }) => `
   display: flex;
    flex-direction: column;
   min-height: auto; // Ensure full page height
    overflow: auto;
    border-radius: 0;
    flex: 1;
`
);



const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
        transform: translateY(0px);
        transition: ${theme.transitions.create(['color', 'transform'])};

        .MuiSvgIcon-root {
            transform: scale(1);
            transition: ${theme.transitions.create(['transform'])};
        }

        &:hover {
            transform: translateY(-2px);
    
            .MuiSvgIcon-root {
                transform: scale(1.3);
            }
        }
  `
);




const isValidURL = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const ANDROID_DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.thepxgroup.vj';
const IOS_DOWNLOAD_URL = 'https://apps.apple.com/th/app/px-vj/id6763715241';



const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(32)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }

  
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(14)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(14)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(16)};
    }

`
);


function Footer() {


  const { data: contactListAll, isLoading: isLoadingContactListAll,
  } = useGetContactListAllQuery();




  const theme = useTheme();
  const { t } = useTranslation();

  const router = useRouter();

  const menuItems = [
    {
      name: 'หน้าหลัก',
      icon: '',
      link: '/home'

    },
    {
      name: 'เกี่ยวกับเรา',
      icon: '',
      link: '/about'

    },
    {
      name: 'กิจกรรม',
      icon: '',
      link: '/activity',

    },
    {
      name: 'บทความ',
      icon: '',
      link: '/article',

    },
    {
      name: 'Privacy Policy',
      icon: '',
      link: '/privacy-policy',

    },

  ]

  const TikTok = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'TikTok' && item.is_active === true);
  const LINE = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'LINE' && item.is_active === true);
  const Phone2 = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'Phone number 2' && item.is_active === true);
  const YouTube = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'YouTube' && item.is_active === true);
  const Phone1 = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'Phone number 1' && item.is_active === true);
  const Facebook = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'Facebook' && item.is_active === true);
  const Instagram = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'Instagram' && item.is_active === true);

  const { data: session, status }: any = useSession();


  return (
    <OverviewWrapper
    >
      {(status != 'authenticated' &&
        <FooterWrapper
          style={{ background: `${theme.colors.gradients.primary}` }}
          display="flex"
          alignItems="center"
          className="footer-wrapper"

        >
          <Container

            sx={{
              width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
              maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
              padding: { xs: '0', sm: '16px' }, // Adjust padding for mobile
              margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens
            }}>



            <Box
              display="flex"
              alignItems="center"
              justifyContent="center" // Center horizontally
              className="w-full h-full" // Occupies full width and height of parent container

            >
              <Grid
                spacing={{
                  md: 10,
                  xs: 2,
                }}
                justifyContent="center"
                alignItems="center"
                container
              >
                <Grid size={{ xs: 12, md: 8 }} style={{ textAlign: 'left' }}>
                  <TypographyH1
                    color='white'
                    variant="h1"
                    sx={{
                      whiteSpace: 'nowrap', // Prevent text wrapping
                    }}
                  >

                    The PX Group
                  </TypographyH1>
                  <TypographyH2
                    sx={{
                      pt: { xs: 2, md: 0 }
                    }}
                    color='white'
                    variant="subtitle1"
                  >

                    รับสมัคร VJ ประจำสังกัด, ทำไม่เป็นสอน ฟรี!
                  </TypographyH2>

                </Grid>

                <Grid size={{ xs: 12, md: 4 }} style={{ textAlign: 'center' }}>
                  <Box>
                    <Button


                      variant="contained"
                      sx={{
                        background: theme.colors.black.main,
                        whiteSpace: 'nowrap', // Prevent text wrapping

                      }}
                      size='large'

                    >
                      {t('สมัครเลย!')}
                    </Button>
                  </Box>

                </Grid>

              </Grid>






            </Box>


          </Container>

        </FooterWrapper>)}

      <FooterWrapper
        style={{ background: `${theme.colors.black.main}` }} display="flex"

        alignItems="center"
        className="footer-wrapper"
      >

        <Container

          sx={{
            width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
            maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
            padding: { xs: '0', sm: '16px' }, // Adjust padding for mobile
            margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens
          }}
        >


          <Box
            display="flex"
            alignItems="center"
            justifyContent="center" // Center horizontally
            className="w-full h-full" // Occupies full width and height of parent container

          >

            <Grid
              spacing={{
                md: 10,
                xs: 2,
              }}
              justifyContent="center"
              alignItems="left"
              container
            >

              <Grid size={{ xs: 12, md: 2.4 }} style={{ textAlign: 'center' }}>

                <Logo

                  imageSrc={LOGO_TEXT_WHITE} />

              </Grid>

              <Grid size={{ xs: 12, md: 2.4 }} style={{ textAlign: 'left' }}>
                <TypographyH2
                  sx={{
                    pt: { xs: 2, md: 0 },
                    mb: 2,
                  }}
                  color='white'
                  variant="subtitle1"
                >
                  ดาวน์โหลดแอป PX VJ
                </TypographyH2>

                <Stack spacing={1} sx={{ width: '100%', maxWidth: 190 }}>
                  <Button
                    component="a"
                    href={IOS_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<AppleIcon />}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'flex-start',
                      px: 1.25,
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.24)',
                      color: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      textTransform: 'none',
                      '& .MuiButton-startIcon': { color: '#fff', mr: 1 },
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.13)' },
                    }}
                  >
                    <Box sx={{ textAlign: 'left', lineHeight: 1.1 }}>
                      <Typography component="span" sx={{ display: 'block', color: 'rgba(255,255,255,0.68)', fontSize: 10 }}>
                        ดาวน์โหลดบน
                      </Typography>
                      <Typography component="span" sx={{ display: 'block', color: '#fff', fontSize: 14, fontWeight: 800 }}>
                        App Store
                      </Typography>
                    </Box>
                  </Button>

                  <Button
                    component="a"
                    href={ANDROID_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<AndroidIcon />}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'flex-start',
                      px: 1.25,
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.24)',
                      color: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      textTransform: 'none',
                      '& .MuiButton-startIcon': { color: '#fff', mr: 1 },
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.13)' },
                    }}
                  >
                    <Box sx={{ textAlign: 'left', lineHeight: 1.1 }}>
                      <Typography component="span" sx={{ display: 'block', color: 'rgba(255,255,255,0.68)', fontSize: 10 }}>
                        ดาวน์โหลดบน
                      </Typography>
                      <Typography component="span" sx={{ display: 'block', color: '#fff', fontSize: 14, fontWeight: 800 }}>
                        Google Play
                      </Typography>
                    </Box>
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 2.4 }} style={{ textAlign: 'left' }}>

                <TypographyH2


                  color='white'
                  sx={{
                    mb: 2,
                  }}
                  variant="subtitle1">

                  {t('เมนู')}
                </TypographyH2>
                <Box
                >
                  {menuItems.map((section, index) => (
                    <ListItem

                      key={index}
                      component="div" >
                      <IconButton

                        sx={{
                          fontSize: `${theme.typography.pxToRem(14)}`,
                          color: `${theme.colors.white.main}`
                        }}

                        onClick={() => {

                          router.push(`${section.link}`)

                        }}>

                        <span

                        >
                          {section.name}
                        </span>

                      </IconButton>
                    </ListItem>
                  ))}
                </Box>

              </Grid>

              <Grid size={{ xs: 12, md: 2.4 }} style={{ textAlign: 'left' }}>
                <TypographyH2

                  sx={{
                    pt: { xs: 2, md: 0 },
                    mb: 2,
                  }}
                  color='white'
                  variant="subtitle1">

                  {t('ช่องทางติดต่อ')}
                </TypographyH2>

                {isLoadingContactListAll ? (
                  // Skeleton for Line Contact
                  <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 2, backgroundColor: 'white' }} />
                ) : LINE ? (
                  <ListItem component="div">
                    {LINE.contact_content && isValidURL(LINE.contact_content) ? (
                      <IconButton
                        sx={{
                          fontSize: `${theme.typography.pxToRem(14)}`,
                          color: `${theme.colors.white.main}`,
                          whiteSpace: 'nowrap',  //nowarp
                        }}
                        onClick={() => {


                          window.open(LINE.contact_content, '_blank');

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: '100%',
                            maxWidth: '25px',
                            mr: 2,
                          }}
                        >
                          <Image
                            src={LOGO_LINE_WHITE} // Use the imageSrc parameter
                            width={500} // Original width (required by Next.js)
                            height={500} // Original height (required by Next.js)
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            alt="Logo"
                          />
                        </Box>
                        {LINE.contact_content}
                      </IconButton>
                    ) : (
                      // Fallback content when LINE.contact_content is invalid or not a URL
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: `${theme.colors.white.main}`,
                          fontSize: `${theme.typography.pxToRem(14)}`,

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: '100%',
                            maxWidth: '25px',
                            mr: 2,
                          }}
                        >
                          <Image
                            src={LOGO_LINE_WHITE} // Use the imageSrc parameter
                            width={500} // Original width (required by Next.js)
                            height={500} // Original height (required by Next.js)
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            alt="Logo"
                          />
                        </Box>
                        <Typography variant="body2" color="inherit"
                          sx={{
                            whiteSpace: 'nowrap',  //nowarp
                          }}
                        >
                          {LINE.contact_content}
                        </Typography>
                      </Box>
                    )}
                  </ListItem>
                ) : ''}




                {isLoadingContactListAll ? (
                  // Skeleton for Line Contact
                  <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 2, backgroundColor: 'white' }} />
                ) : Phone1 ? (
                  <ListItem component="div">
                    {Phone1.contact_content && isValidURL(Phone1.contact_content) ? (
                      <IconButton
                        sx={{
                          fontSize: `${theme.typography.pxToRem(14)}`,
                          color: `${theme.colors.white.main}`,
                          whiteSpace: 'nowrap',  //nowarp

                        }}
                        onClick={() => {

                          window.open(Phone1.contact_content, '_blank');

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            // display: { xs: 'none', sm: 'inline-block' },


                            width: '100%',       // Make the container width 100%
                            maxWidth: '25px',
                            mr: 2,    // Optionally, set a max-width if needed
                          }}
                        >
                          <LocalPhoneOutlined
                            fontSize='medium'
                          // Use the imageSrc parameter
                          // layout="responsive"    // Make the image responsive
                          // width={500}            // Original width (required by Next.js)
                          // height={500}           // Original height (required by Next.js)
                          // alt="Logo"
                          /></Box>
                        {Phone1.contact_content}
                      </IconButton>
                    ) : (
                      // Fallback content when LINE.contact_content is invalid or not a URL
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: `${theme.colors.white.main}`,
                          fontSize: `${theme.typography.pxToRem(14)}`,

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            // display: { xs: 'none', sm: 'inline-block' },


                            width: '100%',       // Make the container width 100%
                            maxWidth: '25px',
                            mr: 2,    // Optionally, set a max-width if needed
                          }}
                        >
                          <LocalPhoneOutlined
                            fontSize='medium'
                          // Use the imageSrc parameter
                          // layout="responsive"    // Make the image responsive
                          // width={500}            // Original width (required by Next.js)
                          // height={500}           // Original height (required by Next.js)
                          // alt="Logo"
                          /></Box>
                        <Typography variant="body2" color="inherit"
                          sx={{
                            whiteSpace: 'nowrap',  //nowarp
                          }}>
                          {Phone1.contact_content}
                        </Typography>
                      </Box>
                    )}
                  </ListItem>
                ) : ''}


                {isLoadingContactListAll ? (
                  // Skeleton for Line Contact
                  <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 2, backgroundColor: 'white' }} />
                ) : Phone2 ? (
                  <ListItem component="div">
                    {Phone2.contact_content && isValidURL(Phone2.contact_content) ? (
                      <IconButton
                        sx={{
                          fontSize: `${theme.typography.pxToRem(14)}`,
                          color: `${theme.colors.white.main}`,
                          whiteSpace: 'nowrap',  //nowarp
                        }}
                        onClick={() => {

                          window.open(Phone2.contact_content, '_blank');
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            // display: { xs: 'none', sm: 'inline-block' },


                            width: '100%',       // Make the container width 100%
                            maxWidth: '25px',
                            mr: 2,    // Optionally, set a max-width if needed
                          }}
                        >
                          <LocalPhoneOutlined
                            fontSize='medium'
                          // Use the imageSrc parameter
                          // layout="responsive"    // Make the image responsive
                          // width={500}            // Original width (required by Next.js)
                          // height={500}           // Original height (required by Next.js)
                          // alt="Logo"
                          /></Box>
                        {Phone2.contact_content}
                      </IconButton>
                    ) : (
                      // Fallback content when LINE.contact_content is invalid or not a URL
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: `${theme.colors.white.main}`,
                          fontSize: `${theme.typography.pxToRem(14)}`,

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            // display: { xs: 'none', sm: 'inline-block' },


                            width: '100%',       // Make the container width 100%
                            maxWidth: '25px',
                            mr: 2,    // Optionally, set a max-width if needed
                          }}
                        >
                          <LocalPhoneOutlined
                            fontSize='medium'
                          // Use the imageSrc parameter
                          // layout="responsive"    // Make the image responsive
                          // width={500}            // Original width (required by Next.js)
                          // height={500}           // Original height (required by Next.js)
                          // alt="Logo"
                          /></Box>
                        <Typography variant="body2" color="inherit"
                          sx={{
                            whiteSpace: 'nowrap',  //nowarp
                          }}
                        >
                          {Phone2.contact_content}
                        </Typography>
                      </Box>
                    )}
                  </ListItem>
                ) : ''}



              </Grid>

              <Grid size={{ xs: 12, md: 2.4 }} style={{ textAlign: 'left' }}>

                <TypographyH2
                  sx={{
                    pt: { xs: 2, md: 0 },
                    mb: 2,
                  }}
                  color='white'
                  variant="subtitle1">

                  {t('โซเชียลมีเดีย')}
                </TypographyH2>


                {isLoadingContactListAll ?
                  <>
                    <Box>
                      <Skeleton variant="circular" width="50%" height={35} sx={{ mb: 2, backgroundColor: 'white' }} />
                    </Box>
                  </>

                  :
                  <Box>
                    {Facebook ? (
                      <Tooltip arrow placement="top" title="Facebook">
                        <IconButtonWrapper
                          onClick={() => {
                            // router.push(`${Facebook.contact_content}`,'blogLink()}}'}>)
                            window.open(Facebook.contact_content, '_blank');

                          }}
                          sx={{
                            boxShadow: `${theme.colors.shadows.primary}`,
                            background: 'white',
                            color: 'black',
                            // '&:hover': {
                            //   background: 'white',
                            //   color: 'black',
                            // },
                            borderRadius: 50,
                            mr: 1,
                            mt: 1,
                            // Add hover effect here
                            '&:hover': {
                              transform: 'translateY(-2px)', // Move up on hover
                              background: 'white',
                              color: 'black',
                              // Apply scaling directly to the image within the IconButtonWrapper
                              '& img': {
                                transform: 'scale(1.3)', // Scale image on hover
                              },
                            },
                            transition: 'transform 0.3s', // Smooth transition for hover effect

                          }}
                          color="primary"
                        >
                          <Image
                            src={LOGO_FACKBOOK} // Path to your SVG
                            alt="FACEBOOK"
                            width={24} // Set the desired width
                            height={24} // Set the desired height
                            style={{ transition: 'transform 0.3s' }}
                          />
                        </IconButtonWrapper>
                      </Tooltip>
                    ) : ''
                    }

                    {Instagram ? (
                      <Tooltip arrow placement="top" title="Instagram">
                        <IconButtonWrapper
                          onClick={() => {
                            // router.push(`${Facebook.contact_content}`,'blogLink()}}'}>)
                            window.open(Instagram.contact_content, '_blank');

                          }}
                          sx={{
                            boxShadow: `${theme.colors.shadows.primary}`,
                            background: 'white',
                            color: 'black',
                            // '&:hover': {
                            //   background: 'white',
                            //   color: 'black',
                            // },
                            borderRadius: 50,
                            mr: 1,
                            mt: 1,
                            // Add hover effect here
                            '&:hover': {
                              transform: 'translateY(-2px)', // Move up on hover
                              background: 'white',
                              color: 'black',
                              // Apply scaling directly to the image within the IconButtonWrapper
                              '& img': {
                                transform: 'scale(1.3)', // Scale image on hover
                              },
                            },
                            transition: 'transform 0.3s', // Smooth transition for hover effect

                          }}
                          color="primary"
                        >
                          <Image
                            src={LOGO_INSTAGRAM} // Path to your SVG
                            alt="TIKTOK"
                            width={24} // Set the desired width
                            height={24} // Set the desired height
                            style={{ transition: 'transform 0.3s' }}
                          />
                        </IconButtonWrapper>
                      </Tooltip>

                    ) : ''}


                    {TikTok ? (
                      <Tooltip arrow placement="top" title="TikTok">
                        <IconButtonWrapper
                          onClick={() => {
                            // router.push(`${Facebook.contact_content}`,'blogLink()}}'}>)
                            window.open(TikTok.contact_content, '_blank');

                          }}
                          sx={{
                            boxShadow: `${theme.colors.shadows.primary}`,
                            background: 'white',
                            color: 'black',
                            // '&:hover': {
                            //   background: 'white',
                            //   color: 'black',
                            // },
                            borderRadius: 50,
                            mr: 1,
                            mt: 1,
                            // Add hover effect here
                            '&:hover': {
                              transform: 'translateY(-2px)', // Move up on hover
                              background: 'white',
                              color: 'black',
                              // Apply scaling directly to the image within the IconButtonWrapper
                              '& img': {
                                transform: 'scale(1.3)', // Scale image on hover
                              },
                            },
                            transition: 'transform 0.3s', // Smooth transition for hover effect

                          }}
                          color="primary"
                        >
                          <Image
                            src={LOGO_TIKTOK} // Path to your SVG
                            alt="TIKTOK"
                            width={24} // Set the desired width
                            height={24} // Set the desired height
                            style={{ transition: 'transform 0.3s' }}
                          />
                        </IconButtonWrapper>
                      </Tooltip>
                    ) : ''}

                    {YouTube ? (
                      <Tooltip arrow placement="top" title="Youtube">
                        <IconButtonWrapper
                          onClick={() => {
                            // router.push(`${Facebook.contact_content}`,'blogLink()}}'}>)
                            window.open(YouTube.contact_content, '_blank');

                          }}
                          sx={{
                            boxShadow: `${theme.colors.shadows.primary}`,
                            background: 'white',
                            color: 'black',
                            // '&:hover': {
                            //   background: 'white',
                            //   color: 'black',
                            // },
                            borderRadius: 50,
                            mr: 1,
                            mt: 1,
                            // Add hover effect here
                            '&:hover': {
                              transform: 'translateY(-2px)', // Move up on hover
                              background: 'white',
                              color: 'black',
                              // Apply scaling directly to the image within the IconButtonWrapper
                              '& img': {
                                transform: 'scale(1.3)', // Scale image on hover
                              },
                            },
                            transition: 'transform 0.3s', // Smooth transition for hover effect

                          }}
                          color="primary"
                        >
                          <Image
                            src={LOGO_YOUTUBE} // Path to your SVG
                            alt="YOUTUBE"
                            width={24} // Set the desired width
                            height={24} // Set the desired height
                            style={{ transition: 'transform 0.3s' }}
                          />
                        </IconButtonWrapper>
                      </Tooltip>

                    ) : ''}



                  </Box>
                }




              </Grid>


            </Grid>




          </Box>
        </Container>


      </FooterWrapper>

    </OverviewWrapper>

  );
}

export default Footer;
