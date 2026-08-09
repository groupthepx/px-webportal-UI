// Shared Styled Components สำหรับ Card Components
// รวม styled components ที่ใช้ซ้ำๆ เพื่อลด code duplication

import { Card, Avatar, Box, Button, Typography, styled, alpha } from '@mui/material';

/**
 * Card component พร้อม border ด้านล่าง
 */
export const CardBorderBottom = styled(Card)(
  ({ theme }) => `
    border-bottom: 5px solid transparent;
    border-block-color: ${theme.palette.primary.main};
  `
);

/**
 * Avatar wrapper สำหรับ profile images
 */
export const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.palette.background.paper};
    width: ${theme.spacing(9)};
    height: ${theme.spacing(9)};
    box-shadow: 0 0.180rem .3rem ${alpha(theme.palette.common.black, 0.3)}, 
                0 .326rem 3rem ${alpha(theme.palette.common.black, 0.2)};
  `
);

/**
 * Avatar wrapper สำหรับ profile card
 */
export const AvatarWrapperProfile = styled(Box)(
  ({ theme }) => `
    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    
    .MuiAvatar-root {
      width: ${theme.spacing(10)};
      height: ${theme.spacing(10)};
    }
  `
);

/**
 * Button สำหรับ user box
 */
export const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 1)};
    color: ${alpha(theme.palette.common.white, 0.5)};
    background-color: ${alpha(theme.palette.common.white, 0.1)};
    border-radius: ${theme.shape.borderRadius}px;
    
    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(24)};
      color: ${alpha(theme.palette.common.white, 0.5)};
    }
    
    .MuiAvatar-root {
      border-radius: ${theme.shape.borderRadius}px;
      width: 60px;
      height: 60px;
    }
    
    &.active,
    &:hover {
      background-color: ${alpha(theme.palette.common.white, 0.2)};
      
      .MuiSvgIcon-root {
        color: ${theme.palette.common.white};
      }
    }
    
    .MuiButton-label {
      justify-content: flex-start;
    }
  `
);

/**
 * Text box สำหรับ user information
 */
export const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
  `
);

/**
 * Label สำหรับ user box (main text)
 */
export const UserBoxLabelMain = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    display: block;
    color: ${theme.palette.text.primary};
  `
);

/**
 * Description สำหรับ user box (secondary text)
 */
export const UserBoxDescriptionMain = styled(Typography)(
  ({ theme }) => `
    color: ${theme.palette.grey[500]};
  `
);

/**
 * Styled TextField สำหรับ input fields
 */
export const StyledTextField = styled('div')(
  ({ theme }) => `
    & .MuiInputBase-root {
      border-radius: ${theme.shape.borderRadius}px;
      font-weight: ${theme.typography.fontWeightBold};
      text-align: center;
      width: 80px;
      
      & input {
        text-align: center;
      }
    }
  `
);

