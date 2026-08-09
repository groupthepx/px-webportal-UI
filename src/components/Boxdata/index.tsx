import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';


const EmptyResultsWrapper = styled('img')(
    ({ theme }) => `
        max-width: 100%;
        width: auto;
        height: ${theme.spacing(17)};
        margin-top: ${theme.spacing(2)};
  `
);
function Boxdata() {

    const { t }: { t: any } = useTranslation();


    return (

        <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'center' }}
        pb={3}
        >
         
            <Typography
                sx={{ fontWeight: 'light', mt: 3 }}
                align="center"
                variant="h4"
                fontWeight="normal"
                color="text.secondary"

                gutterBottom
            >
              <EmptyResultsWrapper src="/assets/svg/Box.svg" />
                {t("ไม่พบข้อมูล")}
            </Typography>

        </Box>

    );
}

export default Boxdata;
