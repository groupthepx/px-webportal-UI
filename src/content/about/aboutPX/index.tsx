
import {
   
    Container,
    Typography,

    styled
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';






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

function AboutPXPage() {

    const { t } = useTranslation();

    const data = {
        title: 'เกี่ยวกับ The PX Group',
        description: `
        <p>The PX Group เป็นองค์กรที่ให้บริการในรูปแบบ สังกัดทำวีเจออนไลน์ ซึ่งเป็นพื้นที่ที่วีเจสามารถสร้างสรรค์และนำเสนอคอนเทนต์ผ่านช่องทางออนไลน์ต่าง ๆ ภายใต้การสนับสนุนและการจัดการที่มีประสิทธิภาพจากทีมงานมืออาชีพ โดยมี โตโต้ซัง ทำหน้าที่เป็น CEO และหัวหน้าของสังกัด PX คอยดูแลกำกับทิศทางและพัฒนาศักยภาพของวีเจในสังกัด เพื่อให้พวกเขาสามารถเติบโตและพัฒนาทักษะในการนำเสนอคอนเทนต์ได้อย่างมีคุณภาพและเป็นมืออาชีพ 
        </br> </br>
        วิสัยทัศน์ของ The PX Group คือการสร้างชุมชนของวีเจที่มีความสามารถและมีคุณภาพสูง ทั้งนี้ องค์กรยังมุ่งเน้นการสร้างความสัมพันธ์อันดีระหว่างวีเจและผู้ชมผ่านการพัฒนาทักษะการสื่อสาร การนำเสนอ และการใช้เครื่องมือเทคโนโลยีที่ทันสมัย นอกจากนี้ การจัดการภายในยังครอบคลุมถึงการประเมินผลการทำงาน การติดตามผลงาน และการจัดการทีมอย่างมีประสิทธิภาพ เพื่อให้แน่ใจว่าวีเจทุกคนสามารถปฏิบัติงานได้อย่างเต็มศักยภาพ
        </br> </br>
        บริษัทมีการใช้ระบบดิจิทัลในการบริหารจัดการทีม เพื่อให้สามารถติดตามผลการทำงานของวีเจในสังกัดได้อย่างมีประสิทธิภาพ รวมถึงการประเมินผลการทำงาน การจัดการตารางการทำงาน และการวิเคราะห์ข้อมูลเพื่อการพัฒนาอย่างต่อเนื่อง
        .</p>
`
    }



    return (
        <Container
            sx={{
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
                margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
            }}

        >


            <Grid
            
                spacing={2}
                justifyContent="center"
                alignItems="center"
                container
                sx={{
                    margin : '20px 40px 40px 40px'
                }}
            >

                <Grid size={{ xs: 12, md: 12 }} style={{ textAlign: 'left' }} >

                    <TypographyH1
                        color='primary' >
                        {t(`${data.title}`)}
                    </TypographyH1>
                </Grid>

                <Grid size={{ xs: 12, md: 12 }} style={{ textAlign: 'left' }} >

                    <TypographyH2
                    variant="subtitle2"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                        >

                    </TypographyH2>
                </Grid>

            </Grid>
        </Container>
    );
}

export default AboutPXPage;
