import React from 'react';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * ErrorFallback Component
 * แสดงหน้า error เมื่อเกิดข้อผิดพลาดใน component
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ErrorOutline color="error" sx={{ fontSize: 64 }} />
          <Typography variant="h3" color="error" gutterBottom>
            เกิดข้อผิดพลาด
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            ขออภัย เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง
          </Typography>
          {process.env.NODE_ENV === 'development' && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                maxWidth: '100%',
                overflow: 'auto',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {error.message}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Refresh />}
            onClick={resetErrorBoundary}
            sx={{ mt: 2 }}
          >
            ลองใหม่อีกครั้ง
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ErrorFallback;

