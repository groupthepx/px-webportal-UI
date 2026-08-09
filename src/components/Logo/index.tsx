import { HEADER_LOGO } from '@/constants/svg';
import { Box, styled } from '@mui/material';
import Image from "next/image";

const LogoWrapper = styled('div')(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

function Logo({ imageSrc = HEADER_LOGO }) { // No width and height here

  return (
    <LogoWrapper>
      <Box
        component="span"
        sx={{
          // display: { xs: 'none', sm: 'inline-block' },


          width: '100%',       // Make the container width 100%
          maxWidth: '500px'     // Optionally, set a max-width if needed
        }}
      >
        <Image
          src={imageSrc}        // Use the imageSrc parameter
          width={500}            // Original width (required by Next.js)
          height={500}           // Original height (required by Next.js)
          style={{ width: '100%', height: 'auto', display: 'block' }}
          alt="Logo"
        />
      </Box>
    </LogoWrapper>
  );
}

export default Logo;
