/**
 * ResponsiveContainer Component
 * ======================================
 * Component สำหรับจัดการ responsive layout ที่ใช้งานได้ทั่วทั้ง project
 */

import { Container, ContainerProps, styled } from '@mui/material';
import { ReactNode } from 'react';

interface ResponsiveContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullHeight?: boolean;
  centerContent?: boolean;
}

const StyledContainer = styled(Container, {
  shouldForwardProp: (prop) => 
    prop !== 'fullHeight' && prop !== 'centerContent'
})<{ fullHeight?: boolean; centerContent?: boolean }>(
  ({ theme, fullHeight, centerContent }) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5),
    },
    ...(fullHeight && {
      minHeight: '100vh',
    }),
    ...(centerContent && {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  })
);

/**
 * ResponsiveContainer - Container ที่ responsive และใช้งานง่าย
 * 
 * @example
 * ```tsx
 * <ResponsiveContainer maxWidth="lg" centerContent>
 *   <YourContent />
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  fullHeight = false,
  centerContent = false,
  ...props
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      fullHeight={fullHeight}
      centerContent={centerContent}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default ResponsiveContainer;

