import {
    Avatar,
    Box,

    Container,
    IconButton,
    ListItem,

    Typography,
    alpha,
    styled,
    useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';

import Image from "next/image";
import { LOGO_LINE_WHITE } from '@/constants/svg';
import { IMAGEPAGEABOUT1, IMAGEPAGEABOUT2, IMAGEPAGEABOUT3 } from '@/constants/image';
const TypographyH1 = styled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(28)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }
  `
);

function TeamUsPage() {

    const { t } = useTranslation();
    const theme = useTheme();



    const data = [
        {
            displayName: 'โตโต้ซัง',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'CEO และหัวสังกัด',
            image: `/assets/image/about/CEO.jpeg`
        },
        {
            displayName: 'ฟาง',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'D-CEO และผู้จัดการ CS',
            image: `/assets/image/about/3.jpeg`
        },
        {
            displayName: 'นัด',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'General Manager (GM) ผู้จัดการทั่วไป',
            image: `/assets/image/about/8.jpeg`
        },
        {
            displayName: 'หมวย',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'Online Operations Manager (OOM) ผู้จัดการฝ่ายปฏิบัติการออนไลน์',
            image: `/assets/image/about/2.jpeg`
        },
      
        {
            displayName: 'มาลิโอ้',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'VJ Coach',
            image: `/assets/image/about/4.jpeg`
        },
      
        {
            displayName: 'แก้ม',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'Business Development – BD พนักงานพัฒนาธุรกิจและจัดหา',
            image: `/assets/image/about/6.jpeg`
        },
        {
            displayName: 'สปาย',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'VJ Administration Manager หัวหน้าแอดมิน VJ',
            image: `/assets/image/about/5.jpeg`
        },
        {
            displayName: 'กะแต',
            link: 'https://line.me/ti/p/jFiFg8pT9x',
            position: 'Customer Service – CS เจ้าหน้าที่บริการลูกค้า',
            image: `/assets/image/about/7.jpeg`
        }
    ]






    return (
        <Container
            sx={{
                width: '100%',
                maxWidth: 'lg',
                padding: { xs: '0', md: '16px' },
                margin: 'auto'
            }}
        >
            <Grid container spacing={2} justifyContent="center" alignItems="center">

                <Grid size={{ xs: 12, md: 12 }} textAlign="center">
                    <TypographyH1 color="white">
                        {t('ทีมงานของเรา')}
                    </TypographyH1>
                </Grid>

                {data.map((item, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 4, md: 3 }}  >
                        <Box
                            sx={{
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                pt: 3,
                                px: 3,
                                pl: 3,
                                pb: 3
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: `${theme.spacing(25)}`,
                                    height: `${theme.spacing(25)}`,
                                    mb: 1.5,
                                    border: `${theme.colors.alpha.white[100]} solid 4px`,
                                    boxShadow: `0 2rem 8rem 0 ${alpha(
                                        theme.colors.alpha.black[100],
                                        0.05
                                    )}, 
                                    0 0.6rem 1.6rem ${alpha(
                                        theme.colors.alpha.black[100],
                                        0.15
                                    )}, 
                                    0 0.2rem 0.2rem ${alpha(
                                        theme.colors.alpha.black[100],
                                        0.1
                                    )}`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                src={item.image}
                            />
                            <Box>


                                <ListItem
                                    style={{
                                        padding: 0,
                                        margin: 0,

                                    }}
                                    sx={{
                                        ml: 1
                                    }}
                                    component="div" >


                                    <Typography

                                        textAlign={'center'}
                                        sx={{
                                            transition: `${theme.transitions.create(['color'])}`,
                                            color: `${theme.colors.alpha.white[100]}`,

                                            fontSize: {
                                                xs: theme.typography.pxToRem(22), // Mobile size
                                                sm: theme.typography.pxToRem(22), // Small screens
                                                md: theme.typography.pxToRem(22), // Medium screens
                                                lg: theme.typography.pxToRem(24)  // Large screens
                                            },
                                        }}
                                        color="white"
                                        variant="h3"

                                    >
                                        {item.displayName}
                                    </Typography>


                                </ListItem>
                                <ListItem
                                    style={{
                                        padding: 0,
                                        margin: '10px 0 0 0',

                                    }}
                                    sx={{

                                        mb: 1
                                    }}
                                    component="div" >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: `${theme.colors.white.main}`,
                                            fontSize: {
                                                xs: theme.typography.pxToRem(12), // Mobile size
                                                sm: theme.typography.pxToRem(12), // Small screens
                                                md: theme.typography.pxToRem(12), // Medium screens
                                                lg: theme.typography.pxToRem(14)  // Large screens
                                            }
                                        }}
                                    >
                                        {item.position}

                                    </Typography>

                                </ListItem>
                                {/* <ListItem

                                    style={{
                                        padding: 0,
                                        margin: '10px 0 0 0',

                                    }}

                                    component="div" >
                                    <IconButton
                                        style={{
                                            padding: 0,


                                        }}
                                        sx={{
                                            fontSize: {
                                                xs: theme.typography.pxToRem(12), // Mobile size
                                                sm: theme.typography.pxToRem(12), // Small screens
                                                md: theme.typography.pxToRem(12), // Medium screens
                                                lg: theme.typography.pxToRem(14)  // Large screens
                                            },
                                            color: `${theme.colors.white.main}`
                                        }}


                                        onClick={() => {


                                        }}>
                                        <Box
                                            component="span"
                                            sx={{
                                                // display: { xs: 'none', sm: 'inline-block' },


                                                width: '100%',       // Make the container width 100%
                                                maxWidth: '22px',
                                                mr: 1,    // Optionally, set a max-width if needed
                                            }}
                                        >
                                            <Image
                                                src={LOGO_LINE_WHITE}        // Use the imageSrc parameter
                                                layout="responsive"    // Make the image responsive
                                                width={500}            // Original width (required by Next.js)
                                                height={500}           // Original height (required by Next.js)
                                                alt="Logo"
                                            />
                                        </Box>


                                        https://lin.ee/sYu8x0B
                                    </IconButton>
                                </ListItem> */}

                            </Box>


                        </Box>



                    </Grid>
                ))}




            </Grid>
        </Container>
    );
}

export default TeamUsPage;
