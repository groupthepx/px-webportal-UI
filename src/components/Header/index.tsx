'use client'
import { HEADER_LOGO } from "@/constants/svg";
import { SidebarContext } from "@/contexts/SidebarContext";
import { useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery } from "@/lib/features/profile";
import { decrypt } from "@/utils/encryption";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Badge, Box, Button, Container, Drawer, IconButton, Tooltip, alpha, styled, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_PORTAL_NOTIFICATIONS, type PortalNotification } from "@/mocks/notifications";
import Logo from "../Logo";
import Scrollbar from "../Scrollbar";
import NavigationMenu from "./NavigationMenu";
import SidebarMenu from "./SidebarMenu";
import HeaderUserbox from "./Userbox";
import NotificationMenu from "../NotificationMenu";

const HeaderWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    position: 'fixed',
    height: theme.spacing(10),
    top: 0,
    left: 0,
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(10),
    transition: 'all 0.3s ease-in-out',
    backdropFilter: 'blur(8px)',
    backgroundColor: alpha(theme.colors.white.light, 0.98),
    boxShadow: theme.palette.mode === 'dark'
        ? `0 1px 0 ${alpha(theme.colors.primary.main, 0.15)}, 
           0px 2px 8px -3px rgba(0, 0, 0, 0.2), 
           0px 5px 22px -4px rgba(0, 0, 0, .1)`
        : `0px 2px 8px -3px ${alpha(theme.colors.alpha.black[100], 0.2)}, 
           0px 5px 22px -4px ${alpha(theme.colors.alpha.black[100], 0.1)}`,
    [theme.breakpoints.down('md')]: {
        height: theme.spacing(8),
    },
    [theme.breakpoints.down('sm')]: {
        height: theme.spacing(7),
    },
}));



const TopSection = styled(Box)(({ theme }) => ({
    margin: theme.spacing(2, 2),
    [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(1, 1),
    },
}));



const SidebarWrapper = styled(Box)(({ theme }) => ({
    width: theme.sidebar.width,
    minWidth: theme.sidebar.width,
    color: theme.sidebar.textColor,
    boxShadow: theme.sidebar.boxShadow,
    position: 'relative',
    zIndex: 5,
    height: '100%',
    [theme.breakpoints.up('lg')]: {
        height: `calc(100% - ${theme.header.height})`,
        marginTop: theme.header.height,
    },
    [theme.breakpoints.down('md')]: {
        width: '280px',
        minWidth: '280px',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        minWidth: '100%',
        maxWidth: '320px',
    },
}));



const IconButtonPrimary = styled(IconButton)(({ theme }) => ({
    display: 'flex',
    width: '48px',
    marginLeft: theme.spacing(2),
    borderRadius: theme.general.borderRadiusLg,
    height: '48px',
    justifyContent: 'center',
    fontSize: theme.typography.pxToRem(13),
    padding: 0,
    position: 'relative',
    color: theme.colors.alpha.trueWhite[50],
    transition: theme.transitions.create(['background-color', 'transform']),
    '& .MuiSvgIcon-root': {
        transition: theme.transitions.create(['color']),
        fontSize: theme.typography.pxToRem(26),
        color: theme.colors.primary.main,
    },
    '&.active, &:hover': {
        backgroundColor: alpha(theme.colors.primary.main, 0.2),
        transform: 'scale(1.05)',
    },
    [theme.breakpoints.down('sm')]: {
        width: '40px',
        height: '40px',
        marginLeft: theme.spacing(1),
        '& .MuiSvgIcon-root': {
            fontSize: theme.typography.pxToRem(22),
        },
    },
}));



function Header() {
    const { t } = useTranslation();
    const theme = useTheme();

    const { sidebarToggle, toggleSidebar, closeSidebar } = useContext(SidebarContext);
    const router = useRouter();
    const { status } = useSession();
    const handleClick = () => {
        router.push('/'); // Navigate to the homepage
    };


    const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
    );
    const { id } = useParams();


    const resolvedParams: any = id ? id : null;
    const ParamsId = resolvedParams && resolvedParams.id ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}` : '0';


    const memberParamsId = !isLoadingProfilegById && ProfileById && ProfileById.data && ProfileById.data.member_id ? `${ProfileById.data.member_id}` : '0';

    const { data: overviewDetailById, } = useGetMemberOverviewDetailByIdQuery(
        { id: `${memberParamsId}`, organizationId: ParamsId },
        { skip: ParamsId === '0' || memberParamsId === '0' }
    );
    const [notificationItems, setNotificationItems] = useState<PortalNotification[]>(() =>
        MOCK_PORTAL_NOTIFICATIONS.map((item) => ({ ...item }))
    );
    const notificationCount = notificationItems.filter((item) => !item.isRead).length;
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null);

    const handleNotificationRead = (id: string) => {
        setNotificationItems((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item));
    };

    const handleNotificationReadAll = () => {
        setNotificationItems((items) => items.map((item) => ({ ...item, isRead: true })));
    };

    return (
        <HeaderWrapper
            style={{ background: theme.colors.white.light }}
        >

            <Container maxWidth="lg"

            >
                <Box display="flex" alignItems="center">
                    <Box display="flex" alignItems="center" flex={1}>
                        <Box
                            display="flex"
                            onClick={handleClick}
                            alignItems="center"
                            sx={{ width: '100%', cursor: 'pointer' }}
                        >
                            <Logo imageSrc={HEADER_LOGO} />
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ width: '100%', display: { xs: 'none', md: 'inline-flex' } }} // Changed inline-block to inline-flex for consistency
                        >
                            <NavigationMenu />
                        </Box>



                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
                        <Box />
                        {status === "unauthenticated" && <Box sx={{ display: { xs: 'none', md: 'inline-block' } }} >

                            <Button
                                onClick={() => router.push('/register')}
                                className="rounded-[20px]"
                                color="inherit"

                                sx={{
                                    fontWeight: 'bold',
                                    borderRadius: 50,
                                    color: theme.colors.gray.main,
                                    borderColor: theme.colors.gray.main,
                                    m: 1,
                                    '&:hover': {
                                        background: '#ffffff',
                                        color: theme.colors.primary.main,
                                        borderColor: theme.colors.primary.main
                                    },
                                }}
                                aria-label={t('Login to system')}
                            >
                                {t('สำหรับสมาชิก')}
                            </Button>
                            <Button
                                onClick={() => router.push('/login')}
                                className="rounded-[10px]"
                                color="inherit"
                                variant="contained"
                                sx={{
                                    background: theme.colors.gradients.primary,
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                    m: 1,
                                    '&:hover': {
                                        background: theme.colors.gradients.primaryHover, // Change to your desired hover gradient
                                    },
                                }}
                                size='large'

                            >
                                {t('เข้าสู่ระบบ')}
                            </Button>





                        </Box>
                        }



                        {status === "authenticated" &&
                            <>
                                <Box display={{ md: 'flex' }} sx={{ justifyContent: 'center', alignItems: 'center' }} >


                                    <Box sx={{ display: { xs: 'none', md: 'inline-block' } }} >

                                        <HeaderUserbox />
                                    </Box>



                                    <Box ml={10} display="flex" alignItems="center">
                                        <IconButton
                                            onClick={(event) => setNotificationAnchorEl(event.currentTarget)}
                                            aria-label="เปิดการแจ้งเตือน"
                                            sx={{
                                                ml: 1,
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <Badge badgeContent={notificationCount} color="error">
                                                <NotificationsNoneOutlinedIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
                                            </Badge>
                                        </IconButton>
                                    </Box>


                                </Box>
                            </>
                        }

                    </Box>
                    {/* <LanguageSwitcher /> */}
                    <Box
                        component="span"
                        sx={{
                            display: 'none'
                        }}
                    >
                        <Tooltip arrow title="เมนู">
                            <IconButtonPrimary
                                color="primary"
                                onClick={() => {
                                    // console.log('Toggle clicked, current state:', sidebarToggle);
                                    toggleSidebar();
                                }}
                            >
                                {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
                            </IconButtonPrimary>
                        </Tooltip>
                    </Box>
                </Box>
            </Container>

            <Drawer
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', sm: '320px' },
                        maxWidth: '90vw',
                        boxSizing: 'border-box',
                    },
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                anchor="right"
                open={sidebarToggle}
                onClose={closeSidebar}
                variant="temporary"
                elevation={9}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <SidebarWrapper
                    sx={{
                        background: theme.colors.gradients.primary,
                        height: '100%',
                    }}
                >
                    <Scrollbar>
                        <TopSection>
                            <Box display="flex" alignItems="center" justifyContent="right" flex={1}>
                                {status === "unauthenticated" &&
                                    <Box sx={{ display: { xs: 'inline-block', md: 'none' } }} >

                                        <Button
                                            onClick={() => router.push('/register')}
                                            className="rounded-[20px]"
                                            color="inherit"

                                            sx={{
                                                fontWeight: 'bold',
                                                borderRadius: 50,
                                                color: theme.colors.gray.main,
                                                borderColor: theme.colors.gray.main,
                                                m: 1,
                                                '&:hover': {
                                                    background: '#ffffff',
                                                    color: theme.colors.primary.main,
                                                    borderColor: theme.colors.primary.main
                                                },
                                            }}
                                            aria-label={t('Login to system')}
                                        >
                                            {t('สำหรับสมาชิก')}
                                        </Button>
                                        <Button
                                            onClick={() => router.push('/login')}
                                            className="rounded-[10px]"
                                            color="inherit"
                                            variant="contained"
                                            sx={{
                                                background: theme.colors.black.main,
                                                fontWeight: 'bold',
                                                color: '#ffffff',

                                                '&:hover': {
                                                    background: theme.colors.black.dark, // Change to your desired hover gradient
                                                },
                                            }}
                                            size='large'

                                        >
                                            {t('เข้าสู่ระบบ')}
                                        </Button>





                                    </Box>
                                }


                                {status === "authenticated" &&
                                    <Box sx={{ display: { xs: 'inline-flex', md: 'none' }, alignItems: 'center', gap: 1, m: 2, mr: 10 }} >
                                        <HeaderUserbox />
                                    </Box>
                                }
                                {/* <Box
                                sx={{
                                    width: 200,
                                    ml: 1,
                                    mt: 1,
                                    mb: 3
                                }}
                            >
                                <Logo

                                    imageSrc={LOGO_TEXT_WHITE} />
                            </Box> */}
                                {/* <SidebarTopSection /> */}
                            </Box>
                        </TopSection>

                        <SidebarMenu />

                    </Scrollbar>
                </SidebarWrapper>
            </Drawer>


            <NotificationMenu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={() => setNotificationAnchorEl(null)}
                items={notificationItems}
                onRead={handleNotificationRead}
                onReadAll={handleNotificationReadAll}
            />

        </HeaderWrapper>


    );
}

export default Header;
