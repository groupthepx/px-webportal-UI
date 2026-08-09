import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

/**
 * EmptyState Component
 * แสดงหน้าเมื่อไม่มีข้อมูล
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'ไม่มีข้อมูล',
  description,
}) => {
  return (
    <Card sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 6,
        }}
      >
        <InboxOutlined sx={{ fontSize: 64, color: 'text.secondary' }} />
        <Typography variant="h4" color="text.secondary" gutterBottom>
          {message}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default EmptyState;

