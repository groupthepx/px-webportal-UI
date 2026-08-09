'use client';
import PageHeader from '@/components/PageHeader';
import { Box, Fade, } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useInView } from 'react-intersection-observer';

import PXMarketPageData from './PXMarket';




function PXMarketPage() {


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


          <Grid mt={1} size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>
              <div ref={landingRef}>
                <PageHeader textHeader='ตลาดPX ' />
              </div>
            </Fade>
          </Grid>
          <Grid size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>
              <div >
                <PXMarketPageData />
              </div>
            </Fade>
          </Grid>


        </Grid>


      </Box>
    </Box>
  );
}

export default PXMarketPage;
