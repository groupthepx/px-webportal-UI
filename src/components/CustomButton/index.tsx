import React from 'react';
import { Button } from '@mui/material';

// Define props for the CustomButton component
interface CustomButtonProps {
  text: string; // Button label
  onClick?: () => void; // Optional click handler
  startIcon?: React.ReactNode; // Optional start icon
  size?: 'small' | 'medium' | 'large'; // Button size
  disabled?: boolean; // Disabled state
  variant?: 'edit' | 'delete' | 'password' | 'email' | 'approve' | 'reject' | 'history'; // Button variant
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  startIcon,
  size = 'medium',
  disabled = false,
  variant = 'edit', // Default variant
}) => {
  // Define styles for each variant
  const variantStyles: Record<
    string,
    { background: string; color: string; hover: { background: string; color: string } }
  > = {
    edit: {
      background: '#000000',
      color: '#ffffff',
      hover: {
        background: '#333333',
        color: '#ffffff',
      },
    },
    delete: {
      background: '#ffcccc',
      color: '#d32f2f',
      hover: {
        background: '#ff9999',
        color: '#b71c1c',
      },
    },
    password: {
      background: '#3949ab',
      color: '#ffffff',
      hover: {
        background: '#303f9f',
        color: '#ffffff',
      },
    },
    email: {
      background: '#ffa726',
      color: '#ffffff',
      hover: {
        background: '#fb8c00',
        color: '#ffffff',
      },
    },
    approve: {
      background: '#4caf50',
      color: '#ffffff',
      hover: {
        background: '#388e3c',
        color: '#ffffff',
      },
    },
    reject: {
      background: '#ff8a80',
      color: '#ffffff',
      hover: {
        background: '#e57373',
        color: '#ffffff',
      },
    },
    history: {
      background: 'transparent',
      color: '#9e9e9e', // gray text
      hover: {
        background: '#f5f5f5',
        color: '#616161',
      },
    },
  };

  // Get styles based on the selected variant
  const styles = variantStyles[variant];

  return (
    <Button
      className="rounded-[60px]"
      color="inherit"
      startIcon={startIcon}
      variant="contained"
      sx={{
        background: styles.background,
        fontWeight: 'bold',
        borderRadius: 50,
        color: styles.color,
        m: 1,
        '&:hover': {
          background: styles.hover.background,
          color: styles.hover.color,
        },
      }}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
