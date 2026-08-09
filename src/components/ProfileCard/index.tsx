import { Box, Card, styled } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

// Background image wrapper behind the frame, dynamic via iconsCard prop
interface StarsWrapperProps {
  bgImage: string;
  width?: number;  // optional width in px, defaults to 310
  height?: number; // optional height in px, defaults to 120
}
const StarsWrapper = styled(
  Box,
  { shouldForwardProp: (prop) => prop !== 'bgImage' && prop !== 'width' && prop !== 'height' }
)<StarsWrapperProps>(({ bgImage, width = 310, height = 120 }) => ({
  position: 'absolute',
  top: -height / 10,         // center vertical offset based on height
  left: '50%',
  width: width,
  height: height,
  transform: 'translateX(-50%)',
  zIndex: 1,
  backgroundImage: `url(${bgImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top',
  backgroundSize: 'contain',
}));

// Frame for the main profile image with dynamic size
type ProfileFrameProps = Pick<ProfileCardProps, 'width' | 'height'>;
const ProfileFrame = styled(
  Card,
  { shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height' }
)<ProfileFrameProps>(({ width = 80, height = 80, theme }) => ({
  position: 'relative',
  width: width - 20,
  height: height - 20,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

interface ProfileCardProps {
  name: string;
  imageSrc: string;
  iconsCard: string; // URL for top background image
  width?: number;    // overall width of profile frame
  height?: number;   // overall height of profile frame
}

const ProfileCard: FC<ProfileCardProps> = ({
  name,
  imageSrc,
  iconsCard,
  width = 80,
  height = 80,
}) => (
  <Box display="flex" alignItems="center" justifyContent="center" p={1}>
    {/* Left section: framed image with dynamic topper */}
    <Box position="relative" >
      <StarsWrapper bgImage={iconsCard} width={width} height={height} />
      <ProfileFrame width={width} height={height}>
        <Image
          src={imageSrc}
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </ProfileFrame>
    </Box>
  </Box>
);

export default ProfileCard;
