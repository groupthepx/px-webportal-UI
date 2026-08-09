import React from 'react';
import { Button, useTheme, SxProps, Theme } from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';

// Define props for the CustomButton component
interface ButtonPrimaryProps {
  text: string; // Button label
  onClick?: () => void; // Optional click handler
  startIcon?: React.ReactNode; // Optional start icon
  size?: 'small' | 'medium' | 'large'; // Button size
  disabled?: boolean; // Disabled state
  hover?: string; // Hover color
  colors?: string; // Background color
  fullWidth?: boolean; // Full width button
  sx?: SxProps<Theme>; // Material-UI sx prop type
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  text,
  onClick,
  startIcon = <VisibilityOutlined />,
  size = 'large',
  disabled = false,
  hover,
  colors,
  fullWidth = false,
  sx = {},
}) => {
  const theme = useTheme(); // Call useTheme unconditionally at the top level

  return (
    <Button
      fullWidth={fullWidth}
      className="rounded-[10px]"
      color="inherit"
      startIcon={startIcon}
      variant="contained"
      sx={{
        background: colors || theme.colors.gradients.primary, // Use the passed colors prop or fallback
        fontWeight: 'bold',
        color: '#ffffff',
        m: 1,
        '&:hover': {
          background: hover || theme.colors.gradients.primaryHover, // Use the passed hover prop or fallback
        },
        ...sx
      }}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ButtonPrimary;
