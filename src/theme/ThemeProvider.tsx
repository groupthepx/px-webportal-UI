'use client';
import { ThemeProvider } from '@mui/material';
import React, { FC, PropsWithChildren } from 'react';
import { themeCreator } from './base';

const ThemeProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <ThemeProvider theme={themeCreator('#F1592A')}>{children}</ThemeProvider>;
};

//'linear-gradient(135deg, #EEA15D 0%, #F1592A 51% , #9F3025 100%)'

export default ThemeProviderWrapper;
