import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  styled
} from '@mui/material';

import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslation } from 'react-i18next';



const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);


function Status500() {
  const { t }: { t: any } = useTranslation();

  const [pending, setPending] = useState(false);
  function handleClick() {
    setPending(true);
  }

  return (
    <>

      <MainContent>
        <Grid
          container
          sx={{
            height: '100%'
          }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            md={12}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <Box
                p={5}
                  sx={{
                    
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    alt="500"
                    height={260}
                    src="/assets/status/500.svg"
                  />
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    my: 2
                  }}
                >
                  {t('There was an error, please try again later')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 4
                  }}
                >
                  {t(
                    'The server encountered an internal error and was not able to complete your request'
                  )}
                </Typography>
                <LoadingButton
                  onClick={handleClick}
                  loading={pending}
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshTwoToneIcon />}
                >
                  {t('Refresh view')}
                </LoadingButton>
                <Button
                  href="/"
                  variant="contained"
                  sx={{
                    ml: 1
                  }}
                >
                  {t('Go back')}
                </Button>
              </Box>
            </Container>
          </Grid>

        </Grid>
      </MainContent>
    </>
  );
}

export default Status500;
