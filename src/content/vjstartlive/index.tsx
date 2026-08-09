'use client';
import PageHeader from '@/components/PageHeader';
import { Box, Fade } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useInView } from 'react-intersection-observer';
import TopVJPageData from './TopVJ';





function VJStartLivePage() {


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


          <Grid mt={1} size={12}>
            <Fade in={landingInView} timeout={2000}>
              <div ref={landingRef}>
                <PageHeader textHeader='หน้าหลัก / วีเจ STAR LIVE' />
              </div>
            </Fade>
          </Grid>
          <Grid size={12}
            sx={{

              padding: { xs: 0, md: 0 },
              margin: { xs: 0, sm: 'auto' },
              background: 'linear-gradient(180deg,rgba(238,161,93,0) 0%, rgba(241,89,42,0.4) 100%)',

            }}
          >
            <Fade in={landingInView} timeout={2000}>
              <div >
                <TopVJPageData />
              </div>
            </Fade>
          </Grid>


        </Grid>


      </Box>
    </Box>
  );
}

export default VJStartLivePage;
