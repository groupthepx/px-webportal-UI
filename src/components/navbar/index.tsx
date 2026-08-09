'use client';

import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { alpha, Box, styled } from '@mui/material';

const NavbarRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
  overflow: 'visible',
  color: theme.palette.text.primary
}));

const NavbarSectionRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
  flexWrap: 'nowrap',
  whiteSpace: 'nowrap',
  overflowX: 'auto',
  overflowY: 'visible',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
}));

export interface NavbarProps {
  children: ReactNode;
  className?: string;
}

export function Navbar({ children, className }: NavbarProps) {
  return <NavbarRoot className={className}>{children}</NavbarRoot>;
}

export interface NavbarSectionProps {
  children: ReactNode;
  className?: string;
}

export function NavbarSection({ children, className }: NavbarSectionProps) {
  return <NavbarSectionRoot className={className}>{children}</NavbarSectionRoot>;
}

export interface NavbarItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  active?: boolean;
  children: ReactNode;
  href?: string;
}

export function NavbarItem({ active = false, children, href = '#', ...props }: NavbarItemProps) {
  return (
    <Box
      {...props}
      component="a"
      href={href}
      sx={(theme) => ({
        minHeight: 40,
        padding: theme.spacing(1, 1.5),
        borderRadius: theme.general.borderRadiusLg,
        color: active ? theme.colors.primary.main : theme.palette.text.primary,
        fontSize: theme.typography.pxToRem(14),
        fontWeight: active ? 700 : 500,
        lineHeight: 1.4,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: theme.transitions.create(['background-color', 'color']),
        '&:hover, &:focus-visible': {
          backgroundColor: alpha(theme.colors.primary.main, 0.08),
          color: theme.colors.primary.main
        }
      })}
    >
      {children}
    </Box>
  );
}
