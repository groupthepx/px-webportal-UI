'use client';
import { Box, Fade, Slide, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LandingPage from './Landing';
import { useInView } from 'react-intersection-observer';
import TopVJPage from './TopVJ';
import ReviewPage from './Review';
import ActivityPage from './Activity';
import ArticlePage from './Article';


function Overview() {
  const theme = useTheme();

  // Define refs for each section
  const { ref: landingRef, inView: landingInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: topVJPageRef, inView: topVJPageInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: reviewPageRef, inView: reviewPageInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: activityPageRef, inView: activityPageInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: articlePageRef, inView: articlePageInView } = useInView({
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
        <Grid justifyContent="center" alignItems="center" container>

          <Grid sx={{ backgroundColor: '#FFF4EB' }} size={{ md: 12 }}>
            <Fade in={landingInView} timeout={2000}>

              <div ref={landingRef}>
                <LandingPage />
              </div>
            </Fade>
          </Grid>

	          <Grid size={{ md: 12 }} sx={{

            padding: { xs: 0, md: 0 },
            margin: { xs: 0, sm: 'auto' },
            background: 'linear-gradient(180deg,rgba(238,161,93,0) 0%, rgba(241,89,42,0.4) 100%)',
      
          }} >

            <div ref={topVJPageRef}

            >
              <Slide direction="right" in={topVJPageInView} timeout={2000}>

                <div>
                  <Box m={5}>
                    <TopVJPage />
                  </Box>
                </div>
              </Slide>
            </div>
          </Grid>

          <Grid
            style={{ background: `${theme.colors.gradients.primary}` }}
            size={{ md: 12 }} >

            <div ref={reviewPageRef}>
              <Slide direction="right" in={reviewPageInView} timeout={2000}>

                <div>
                  <Box m={5}>
                    <ReviewPage />
                  </Box>
                </div>
              </Slide>
            </div>
          </Grid>

          <Grid size={{ md: 12 }}>

            <div ref={activityPageRef}>
              <Slide direction="right" in={activityPageInView} timeout={2000}>

                <div >
                  <Box m={5}>
                    <ActivityPage />
                  </Box>
                </div>
              </Slide>
            </div>
          </Grid>


          <Grid size={{ md: 12 }}>

            <div ref={articlePageRef}>
              <Slide direction="right" in={articlePageInView} timeout={2000}>

                <div>
                  <Box m={5}>
                    <ArticlePage />
                  </Box>
                </div>
              </Slide>
            </div>
          </Grid>

        </Grid>


      </Box>
    </Box>
  );
}

export default Overview;
