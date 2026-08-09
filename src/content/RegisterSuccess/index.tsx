'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Box, Button, Card, Container, Stack, Typography, useTheme } from '@mui/material';

export default function RegisterSuccess() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#f7f8fa', p: 2 }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid rgba(15,23,42,.08)', borderRadius: 3, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <CheckCircleRoundedIcon sx={{ fontSize: 72, color: '#16a34a' }} />
            <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 25, md: 32 }, fontWeight: 800 }}>
              สมัครเรียบร้อยแล้ว
            </Typography>
            <Typography sx={{ color: theme.colors.gray.main, fontSize: 15, lineHeight: 1.8 }}>
              ขอบคุณสำหรับความสนใจเข้าร่วมครอบครัว PX
              <br />
              การสมัครเข้าร่วมเป็น VJ ของท่านเสร็จสมบูรณ์
              <br />
              กรุณารอการแจ้งเตือนจากทีมงานของเรา
            </Typography>
            <Button href="/home" variant="contained" sx={{ mt: 1, minWidth: 180, background: theme.colors.gradients.primary }}>
              กลับหน้าหลัก
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
