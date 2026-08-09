import React, { useMemo } from 'react';
import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import Boxdata from '@/components/Boxdata';
import Label from '@/components/Label';
import { WithdrawCoinHistoryTableProps, TransferHistoryItem } from '../types';
import {
  TRANSFER_STATUS_LABELS,
  TRANSFER_STATUS_COLORS,
  TABLE_HEADERS,
} from '../constants';

/**
 * TableRowSkeleton Component
 * แสดง loading skeleton สำหรับแต่ละแถวในตาราง
 */
const TableRowSkeleton: React.FC = React.memo(() => (
  <TableRow>
    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
  </TableRow>
));

TableRowSkeleton.displayName = 'TableRowSkeleton';

/**
 * TransferHistoryRow Component
 * แสดงข้อมูลแต่ละแถวของประวัติการแลกเปลี่ยน
 * ใช้ React.memo เพื่อป้องกัน unnecessary re-renders
 */
const TransferHistoryRow: React.FC<{ item: TransferHistoryItem; index: number }> = React.memo(
  ({ item, index }) => {
    const formattedDate = useMemo(() => {
      return item.created_at
        ? format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')
        : 'N/A';
    }, [item.created_at]);

    const formattedCoin = useMemo(() => {
      return item.coin ? item.coin.toLocaleString() : 'N/A';
    }, [item.coin]);

    const formattedBalance = useMemo(() => {
      return item.balance ? item.balance.toLocaleString() : 'N/A';
    }, [item.balance]);

    const statusLabel = useMemo(() => {
      if (item.status === 'Success') {
        return (
          <Label color={TRANSFER_STATUS_COLORS.Success as any}>
            {TRANSFER_STATUS_LABELS.Success}
          </Label>
        );
      }
      if (item.status === 'Reject') {
        return (
          <Label color={TRANSFER_STATUS_COLORS.Reject as any}>
            {TRANSFER_STATUS_LABELS.Reject}
          </Label>
        );
      }
      return null;
    }, [item.status]);

    return (
      <TableRow hover key={index}>
        <TableCell className="whitespace-nowrap" align="left">
          <Typography variant="subtitle1">{formattedDate}</Typography>
        </TableCell>
        <TableCell align="left" className="whitespace-nowrap">
          <Typography variant="h4">{formattedCoin}</Typography>
        </TableCell>
        <TableCell align="left" className="whitespace-nowrap">
          <Typography variant="h4">{formattedBalance}</Typography>
        </TableCell>
        <TableCell align="left" className="whitespace-nowrap">
          <Typography variant="subtitle1">{statusLabel}</Typography>
        </TableCell>
      </TableRow>
    );
  }
);

TransferHistoryRow.displayName = 'TransferHistoryRow';

/**
 * WithdrawCoinHistoryTable Component
 * แสดงตารางประวัติการแลกเปลี่ยน Coin
 * ใช้ optimization techniques เพื่อปรับปรุง performance
 */
const WithdrawCoinHistoryTable: React.FC<WithdrawCoinHistoryTableProps> = React.memo(
  ({ transferCoinBalance, error, memberId, isLoading = false }) => {
    const { t } = useTranslation();

    // Filter และ sort ข้อมูลโดยใช้ useMemo เพื่อ cache ผลลัพธ์
    const filteredTransfers = useMemo(() => {
      if (!transferCoinBalance?.data) return [];

      const data = transferCoinBalance.data;

      // Check if data is already filtered (contains only one member's data)
      const hasSingleMemberData = data.every((item: any) => item.created_by_id === memberId) ||
                                 data.every((item: any) => item.created_by_id === undefined);

      if (hasSingleMemberData) {
        // Data is already filtered, just sort by date
        return data.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      } else {
        // Filter by memberId and sort by date
        return data
          .filter((item: any) => item.created_by_id === memberId)
          .sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
      }
    }, [transferCoinBalance, memberId]);

    // console.log("transferCoinBalance", transferCoinBalance)

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    const hasNoData = useMemo(() => {
      return error || filteredTransfers.length === 0;
    }, [error, filteredTransfers.length]);

    // แสดง loading state
    if (isLoading) {
      return (
        <Container
          sx={{
            width: { xs: '100%', sm: 'auto' },
            maxWidth: 'lg',
            padding: { xs: '0', md: '0px' },
            margin: { xs: '0', sm: 'auto' },
          }}
        >
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'transparent' }}>
                    <TableCell align="left">{t(TABLE_HEADERS.REQUEST_DATE)}</TableCell>
                    <TableCell align="left">{t(TABLE_HEADERS.COIN_AMOUNT)}</TableCell>
                    <TableCell align="left">{t(TABLE_HEADERS.THB_AMOUNT)}</TableCell>
                    <TableCell align="left">{t(TABLE_HEADERS.STATUS)}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
      );
    }

    return (
      <Container
        sx={{
          width: { xs: '100%', sm: 'auto' },
          maxWidth: 'lg',
          padding: { xs: '0', md: '0px' },
          margin: { xs: '0', sm: 'auto' },
        }}
      >
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'transparent' }}>
                  <TableCell align="left">{t(TABLE_HEADERS.REQUEST_DATE)}</TableCell>
                  <TableCell align="left">{t(TABLE_HEADERS.COIN_AMOUNT)}</TableCell>
                  <TableCell align="left">{t(TABLE_HEADERS.THB_AMOUNT)}</TableCell>
                  <TableCell align="left">{t(TABLE_HEADERS.STATUS)}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hasNoData ? (
                  <TableRow hover>
                    <TableCell colSpan={4} className="whitespace-nowrap" align="left">
                      <Typography
                        sx={{ py: 10 }}
                        variant="h6"
                        fontWeight="normal"
                        color="text.secondary"
                        align="center"
                      >
                        <Boxdata />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((item : any, index) => (
                    <TransferHistoryRow
                      key={`${item.transfer_coin_balance_history_id || item.created_at}-${index}`}
                      item={item}
                      index={index}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    );
  }
);

WithdrawCoinHistoryTable.displayName = 'WithdrawCoinHistoryTable';

export default WithdrawCoinHistoryTable;
