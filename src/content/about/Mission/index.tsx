
import {
  Box,

  Container,


  Typography,
  styled,
  useTheme
} from '@mui/material';

import Image from "next/image";

import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';

import { MISSION_IMAGE } from '@/constants/svg';

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
const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);


const ImgWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: ${theme.general.borderRadiusLg};

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${theme.general.borderRadiusLg}; 
    }
  `
);



function MissionPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Container
      sx={{
        width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
        maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
        padding: { xs: '0', sm: '0px' }, // Adjust padding for mobile
        margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens
      }}

    >


      <Grid
      m={5}

        justifyContent="center"
        alignItems="center"
        container
      >



        <Grid mb={5} size={{ xs: 12, md: 5 }} sx={{ textAlign: { xs: 'center', md: 'left' } }} >



          {/* <LabelWrapper color="success">{t('Version') + ' 3.1'}</LabelWrapper> */}
          <TypographyH1
            sx={{
              mb: 2,
           
            }}
            style={{
              background: `${theme.colors.gradients.primary}`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
        
            }}

            variant="h3"
          >

            {t(`ภารกิจของ The PX Group`)}

          </TypographyH1>
          <TypographyH2
            sx={{
              lineHeight: 1.5,
              pb: 1
            }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            {t(
              'The PX Group มุ่งเน้นการสร้างแพลตฟอร์มที่ส่งเสริมการเติบโตของวีเจผ่านการสนับสนุนด้านเทคโนโลยีและการฝึกอบรม จัดการดูแลวีเจอย่างเป็นระบบเพื่อให้พร้อมสร้างคอนเทนต์คุณภาพ และพัฒนาทักษะการสื่อสารเพื่อสร้างความสัมพันธ์ที่ดีกับผู้ชม'
            )}
          </TypographyH2>

        </Grid>

        <Grid p={5} size={{ xs: 12, md: 7 }} >

          {/* <BoxContent
  sx={{
    animation: '2.8s 1.2s infinite alternate ease-in-out float'
  }}
> */}

          <ImgWrapper>
            <Image
              layout="responsive"    // Makes the image responsive
              width={800}            // Set desired width
              height={400}           // Set desired height
              alt="Logo"
              src={MISSION_IMAGE}
            />
          </ImgWrapper>

          {/* <BoxAccent
    sx={{
      display: { xs: 'none', md: 'block' }
    }}
  /> */}
          {/* </BoxContent> */}


        </Grid>

      </Grid>
    </Container>
  );
}

export default MissionPage;
