import { Box, Card, styled } from '@mui/material';

/**
 * Styled component สำหรับ User Box Button
 * ใช้แสดงข้อมูล profile ของ user
 */
export const UserBoxButton = styled(Box)(
  ({ theme }) => `
  padding: ${theme.spacing(0, 1)};
  color: ${theme.colors.alpha.trueWhite[50]};
  background-color: ${theme.colors.alpha.white[10]};
  border-radius: ${theme.general.borderRadiusLg};

  .MuiSvgIcon-root {
    transition: ${theme.transitions.create(['color'])};
    font-size: ${theme.typography.pxToRem(24)};
    color: ${theme.colors.alpha.trueWhite[50]};
  }

  .MuiAvatar-root {
    border-radius: ${theme.general.borderRadiusLg};
    width: 50px;
    height: 50px;
  }

  &.active,
  &:hover {
    background-color: ${theme.colors.alpha.white[30]};

    .MuiSvgIcon-root {
      color: ${theme.colors.alpha.trueWhite[100]};
    }
  }

  .MuiButton-label {
    justify-content: flex-start;
  }
`
);

/**
 * Styled component สำหรับ Card ที่มี border ด้านล่าง
 * ใช้สำหรับแสดง wallet details
 */
export const CardBorderBottom = styled(Card)(
  () => `
  border-bottom: transparent 5px solid;
`
);

/**
 * Styled component สำหรับ Container ของหน้า
 */
export const PageContainer = styled(Box)(
  () => `
  position: relative;
  z-index: 5;
  display: block;
  flex: 1;
`
);

/**
 * Styled component สำหรับ Content Wrapper
 */
export const ContentWrapper = styled(Box)(
  ({ theme }) => `
  background-color: ${theme.palette.background.default};
`
);

