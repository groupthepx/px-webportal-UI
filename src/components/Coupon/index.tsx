import { FC, useMemo } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    Dialog,
    DialogTitle,
    IconButton,
    Typography,
    Zoom,
    styled
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import { Close } from '@mui/icons-material';
import {
    useGetMemberByIdQuery,
    useGetMemberOverviewDetailByIdQuery,
    useGetProfileByIdQuery
} from '@/lib/features/profile';
import Image from 'next/image';
import { useUpdateClaimCouponMoveMutation, useUpdateClaimCouponMoveNonOrgMutation } from '@/lib/features/coupon';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'next/navigation';
import { decrypt } from '@/utils/encryption';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';

const UserBoxButton = styled(Box)(
    ({ theme }) => `
    padding: ${theme.spacing(0, 1)};
    color: ${theme.colors.alpha.trueWhite[50]};
    border-radius: ${theme.general.borderRadiusLg};

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(24)};
      color: ${theme.colors.alpha.trueWhite[50]};
    }

    .MuiAvatar-root {
      border-radius: ${theme.general.borderRadiusLg};
      width: 70px;
      height: 100%;
    }

    .MuiButton-label {
      justify-content: flex-start;
    }
  `
);

const UserBoxText = styled(Box)(({ theme }) => `
  text-align: left;
  padding-left: ${theme.spacing(1)};
`);

const UserBoxLabelMain = styled(Typography)(({ theme }) => `
  font-weight: ${theme.typography.fontWeightBold};
  display: block;
  color: ${theme.colors.white.main};
`);

const UserBoxDescriptionMain = styled(Typography)(({ theme }) => `
  color: ${theme.colors.gray.main};
`);

interface Props {
    openAction: boolean;
    handleActionClose: () => void;
}

const CouponBoxItems: FC<Props> = ({ openAction, handleActionClose }) => {
    // -------- profile & route params --------
    const { data: ProfileById, isLoading: isLoadingProfileById } = useGetProfileByIdQuery();
    const { id } = useParams();

    const resolvedParams: any = id ? id : null;
    const ParamsId = resolvedParams ? `${decrypt(decodeURIComponent(resolvedParams as string))}` : '0';

    const memberParamsId =
        !isLoadingProfileById && ProfileById?.data?.member_id
            ? String(ProfileById.data.member_id)
            : '0';

    // -------- member queries --------
    useGetMemberOverviewDetailByIdQuery(
        { id: memberParamsId, organizationId: ParamsId },
        { skip: ParamsId === '0' || memberParamsId === '0' }
    );

    const {
        data: memberById,
        isLoading: isLoadingMemberById,
        refetch: memberListAllRefetch
    } = useGetMemberByIdQuery(
        { id: memberParamsId },
        { skip: memberParamsId === '0' }
    );

    const memberDetail = memberById?.data ?? null;
    const couponItemsList: any[] = memberDetail?.coupon ?? [];

    // -------- mutation --------
    const [
        claimCouponComission,
        {
            isLoading: isPosting,
            isSuccess: isPostSuccess,
            isError: isPostError
        }
    ] = useUpdateClaimCouponMoveMutation();


    const [
        claimCouponNonOrgComission,
        {
            isLoading: isPostingNonOrg,
            isSuccess: isPostSuccessNonOrg,
            isError: isPostErrorNonOrg
        }
    ] = useUpdateClaimCouponMoveNonOrgMutation();

// general_member
    // -------- organization list -> Map --------
    const { data: organizationListAll } = useGetOrganizationListAllQuery();
    const organizationData: any[] =
        organizationListAll?.data?.filter((o: any) => o.is_active === true) ?? [];

    const orgById = useMemo(() => {
        const m = new Map<string, any>();
        for (const o of organizationData) {
            m.set(String(o.organization_id), o);
        }
        return m;
    }, [organizationData]);

    // -------- helpers --------
    const getOrgName = (orgId: any) =>
        orgById.get(String(orgId))?.company_name ?? '';

    const fmtDateTime = (iso?: string) => {
        if (!iso) return 'N/A';
        try {
            return format(new Date(iso), 'dd/MM/yyyy HH:mm:ss');
        } catch {
            return 'N/A';
        }
    };

    const handleClaim = async (item: any) => {
        try {
            const rsp = 
            memberDetail && memberDetail.member_type === 'vj_member' ?
            await claimCouponComission({
                data: {
                    coupon_id: item.coupon_id,
                    member_id: memberParamsId,
                    organization_id: item.organization_id
                }
            }):
               await claimCouponNonOrgComission({
                data: {
                    coupon_id: item.coupon_id,
                    member_id: memberParamsId,
                    // organization_id: item.organization_id
                }
            })
            ;

            // @ts-ignore — unwrap differs by RTK version; check your API slice if needed
            const payload = rsp?.data ?? rsp;

            if (payload?.data?.status === 200 || payload?.status === 200  ) {
                enqueueSnackbar(`รับอังเปา สำเร็จ`, {
                    variant: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    TransitionComponent: Zoom
                });
                handleActionClose();
                // อาจเลือก refetch ถ้าต้องการรีเฟรชรายการทันที
                // await memberListAllRefetch();
            } else {
                enqueueSnackbar(`ไม่สามารถรับอังเปาได้`, {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    TransitionComponent: Zoom
                });
            }
        } catch (e) {
            enqueueSnackbar(`เกิดข้อผิดพลาดระหว่างรับอังเปา`, {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                TransitionComponent: Zoom
            });
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={openAction} onClose={handleActionClose}>
            <DialogTitle>
                <Typography variant="h4" gutterBottom>
                    รายการอังเปา
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    กดเพื่อรับอังเปา
                </Typography>
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={handleActionClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500]
                })}
            >
                <Close />
            </IconButton>

            <Grid container spacing={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {couponItemsList.length > 0 ? (
                    couponItemsList.map((item: any, index: number) => {
                        const status = String(item.status ?? '');
                        const isClaimed = status === 'claimed';
                        const isAvailable = status === 'sending'; // ปรับตามสภาวะจาก API ของคุณ

                        return (
                            <Grid key={item.coupon_id ?? index} size={12}>
                                <Card
                                    sx={{
                                        backgroundColor: '#F7BB38',
                                        borderRadius: 2,
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        opacity: isClaimed ? 0.6 : 1
                                    }}
                                >
                                    <UserBoxButton
                                        sx={{ cursor: 'default', width: '100%', display: 'flex', alignItems: 'center' }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            alt="redpacket"
                                            src={
                                                isClaimed
                                                    ? '/assets/svg/pg/redpacket-gray.svg'
                                                    : '/assets/svg/pg/redpacket.svg'
                                            }
                                            sx={{ width: 100, height: 100 }}
                                        />

                                        <Box flex={1} ml={2} minWidth={200}>
                                            <UserBoxText>
                                                <UserBoxLabelMain color="white" variant="h3">
                                                    {item?.amount ? Number(item.amount).toLocaleString() : '0'} Coin
                                                </UserBoxLabelMain>

                                                <UserBoxDescriptionMain variant="body2">
                                                    <Typography variant="subtitle1" color="primary">
                                                        {getOrgName(item?.organization_id)}
                                                    </Typography>

                                                    <Typography variant="subtitle1" color="gray">
                                                        {fmtDateTime(item?.created_at)}
                                                    </Typography>

                                                    <Box mt={1} display="flex" gap={1}>
                                                        <Button
                                                            variant="contained"
                                                            color="inherit"
                                                            disabled={!isAvailable || isClaimed || isPosting || isPostingNonOrg}
                                                            sx={{
                                                                backgroundColor: isAvailable && !isClaimed ? '#000' : '#d3d3d3',
                                                                color: '#fff',
                                                                minWidth: { xs: 'auto', sm: '140px' },
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        isAvailable && !isClaimed ? '#222' : '#d3d3d3'
                                                                }
                                                            }}
                                                            onClick={() => handleClaim(item)}
                                                        >
                                                            รับอังเปา
                                                        </Button>
                                                    </Box>
                                                </UserBoxDescriptionMain>
                                            </UserBoxText>
                                        </Box>
                                    </UserBoxButton>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Grid
                        size={12}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 4 }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Image
                                src="/assets/svg/pg/no-red-packet.svg"
                                alt="No Red Packet"
                                width={100}
                                height={100}
                            />
                        </Box>
                        <Typography variant="subtitle1" color="textSecondary">
                            ไม่มีอังเปา!
                        </Typography>
                    </Grid>
                )}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
                <Button variant="contained" color="error" onClick={handleActionClose} sx={{ minWidth: 100 }}>
                    ปิด
                </Button>
            </Box>
        </Dialog>
    );
};

export default CouponBoxItems;
