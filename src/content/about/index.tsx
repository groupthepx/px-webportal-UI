'use client';
import PageHeader from '@/components/PageHeader';
import { Box, Fade, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useInView } from 'react-intersection-observer';

import AboutPXPage from './aboutPX';
import TeamUsPage from './TeamUs';
import MissionPage from './Mission';

function AboutPage() {
  const theme = useTheme();

  // Define refs for each section
  const { ref: landingRef, inView: landingInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });



  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 5,
        display: 'block',
        flex: 1,
      }}
    >
      <Box display="block">
        <Grid sx={{ backgroundColor: '#F7F8F9' }} justifyContent="left" alignItems="center" container>
        

          <Grid mt={1}  size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>
              <div ref={landingRef}>
                <PageHeader textHeader='เกี่ยวกับเรา' />
              </div>
            </Fade>
          </Grid>
          <Grid  size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>
              <div >
                <AboutPXPage/>
              </div>
            </Fade>
          </Grid>
          <Grid  style={{ background: `${theme.colors.gradients.primary}` }}  size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>
              <div >
                <TeamUsPage/>
              </div>
            </Fade>
          </Grid>

          <Grid  
          // style={{ background: `${theme.colors.gradients.primary}` }}
          
          size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>
              <div >
                <MissionPage/>
              </div>
            </Fade>
          </Grid>
       

        </Grid>


      </Box>
    </Box>
  );
}

export default AboutPage;
