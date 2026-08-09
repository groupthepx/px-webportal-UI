"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  AssignmentTurnedInOutlined,
  BusinessOutlined,
  CardGiftcardOutlined,
  HistoryOutlined,
  HomeOutlined,
  LiveTvOutlined,
  NotificationsNoneOutlined,
  PersonOutline,
  SchoolOutlined,
  StarOutline
} from "@mui/icons-material";

type WebPortalShellView =
  | "home"
  | "application-status"
  | "profile"
  | "wallet"
  | "training"
  | "level"
  | "live"
  | "market"
  | "angpao"
  | "history"
  | "notifications";

interface Props {
  view: WebPortalShellView;
}

const shellData = {
  home: {
    title: "Member Home",
    subtitle: "Status summary, next action, onboarding, lesson and level widgets",
    icon: HomeOutlined,
    accent: "#2563eb",
    kpis: [["Account", "WEB_APPROVED"], ["Onboarding", "2/4 tasks"], ["Lesson", "66%"], ["Level", "Level 2"]],
    cards: ["Next Action: เรียนบทที่ 3 ให้ครบ", "Application status after account only", "Notification summary", "Bonus status"]
  },
  "application-status": {
    title: "Application Status",
    subtitle: "Recruitment timeline และ Add App case หลังสร้าง account แล้ว",
    icon: AssignmentTurnedInOutlined,
    accent: "#0f766e",
    kpis: [["Case", "INITIAL_APPLY"], ["Status", "BONUS_ACTIVE"], ["Add App", "1 pending"], ["Owner", "Web Admin"]],
    cards: ["BD Reviewed", "HR Approved", "Training Passed", "Web Approved"]
  },
  profile: {
    title: "Profile / App Organization",
    subtitle: "ข้อมูลส่วนตัว, KYC, bank account, company/app list",
    icon: PersonOutline,
    accent: "#7c3aed",
    kpis: [["PX ID", "PX-10291"], ["KYC", "Approved"], ["Apps", "3"], ["Bank", "Verified"]],
    cards: ["Personal profile", "KYC status", "Company / App list", "Bank account"]
  },
  wallet: {
    title: "Wallet / Withdraw",
    subtitle: "Money balance, PX Coin, withdraw and report",
    icon: AccountBalanceWalletOutlined,
    accent: "#ea580c",
    kpis: [["Money", "THB 18,240"], ["PX Coin", "42,800"], ["Withdraw", "1 pending"], ["Report", "Jul 2026"]],
    cards: ["Withdraw money", "Exchange coin", "Bank information", "Withdraw report"]
  },
  training: {
    title: "Training / Lesson",
    subtitle: "VJ Star Video, lesson progress, exam/result, warning only in MVP",
    icon: SchoolOutlined,
    accent: "#16a34a",
    kpis: [["Lessons", "2/3"], ["Exam", "Pending"], ["Deadline", "12 days"], ["Block", "Warning only"]],
    cards: ["Lesson 1 completed", "Lesson 2 completed", "Lesson 3 in progress", "Incomplete warning"]
  },
  level: {
    title: "Level / Reward / STAR LIVE",
    subtitle: "Level 1-4 progress, manual pending, auto completed conditions",
    icon: StarOutline,
    accent: "#9333ea",
    kpis: [["Level 1", "100 pts"], ["Level 2", "60%"], ["Manual", "3 pending"], ["Auto", "5 recorded"]],
    cards: ["เข้ากลุ่ม VJ - Manual pending", "ได้รับเหรียญ Sapphire - Auto record", "VJ Active - Auto record", "ฝึก 10 Step - Manual pending"]
  },
  live: {
    title: "Live",
    subtitle: "VJ Star Live, start live, live history and approval status",
    icon: LiveTvOutlined,
    accent: "#db2777",
    kpis: [["Live Month", "18"], ["Points", "8,420"], ["Approval", "92%"], ["Pending", "1"]],
    cards: ["Start live", "Live history", "Approval status", "Point summary"]
  },
  market: {
    title: "Market / Gift / AngPao",
    subtitle: "PX Market, gift box, market history and AngPao",
    icon: CardGiftcardOutlined,
    accent: "#0284c7",
    kpis: [["Gift", "4"], ["AngPao", "2"], ["Orders", "8"], ["Coin", "42,800"]],
    cards: ["PX Market", "Gift Box", "AngPao list", "Market history"]
  },
  angpao: {
    title: "อังเปา",
    subtitle: "รับอังเปา ตรวจสอบรายการ และดูประวัติการได้รับ",
    icon: CardGiftcardOutlined,
    accent: "#f59e0b",
    kpis: [["รอรับ", "2"], ["ได้รับแล้ว", "18"], ["มูลค่ารวม", "12,800"], ["เดือนนี้", "3"]],
    cards: ["อังเปาที่ยังไม่ได้รับ", "ประวัติการได้รับอังเปา", "รายละเอียดรายการ", "การแจ้งเตือนอังเปา"]
  },
  history: {
    title: "History",
    subtitle: "Member history, friend/refer, points, withdraw, market",
    icon: HistoryOutlined,
    accent: "#475569",
    kpis: [["Transactions", "248"], ["Income", "THB 48,200"], ["Expense", "THB 6,400"], ["Refer", "18"]],
    cards: ["Member history", "Friend / refer history", "Points history", "Withdraw history"]
  },
  notifications: {
    title: "Notifications",
    subtitle: "Inbox, reminder, read/unread, deep-link to action",
    icon: NotificationsNoneOutlined,
    accent: "#4f46e5",
    kpis: [["Unread", "6"], ["Lesson", "2"], ["Withdraw", "1"], ["System", "3"]],
    cards: ["Lesson reminder", "Onboarding reminder", "Withdraw status update", "Add App status"]
  }
} as const;

const navItems: Array<[WebPortalShellView, string]> = [
  ["home", "Home"],
  ["application-status", "Application"],
  ["profile", "Profile"],
  ["wallet", "Wallet"],
  ["training", "Lesson"],
  ["level", "Level"],
  ["live", "Live"],
  ["market", "Market"],
  ["history", "History"],
  ["notifications", "Notifications"]
];

function SystemMemberShell({ view }: Props) {
  const data = shellData[view];
  const Icon = data.icon;
  const notificationLinks = [
    ["อังเปาที่ได้รับ", "/member/angpao"],
    ["คะแนนที่ได้รับ", "/profile/points_history"],
    ["ของขวัญที่ได้รับ", "/gift_box"],
  ] as const;

  return (
    <Box sx={{ backgroundColor: "#F7F8F9", py: { xs: 3, md: 5 }, minHeight: "calc(100vh - 180px)" }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Alert severity="info">
            Phase 1 Web Portal member shell ใช้ mock data เท่านั้น Register เดิมจะถูกใช้เป็น Recruitment Apply ใน phase ถัดไป
          </Alert>

          <Card>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      color: "#fff",
                      backgroundColor: data.accent
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box>
                    <Typography variant="h3">{data.title}</Typography>
                    <Typography color="text.secondary">{data.subtitle}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Chip label="PX VJ Member" color="primary" variant="outlined" />
                  <Chip label="Mock screen" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction="row" gap={1} flexWrap="wrap">
            {navItems.map(([key, label]) => (
              <Button
                key={key}
                href={`/member/${key}`}
                variant={key === view ? "contained" : "outlined"}
                size="small"
              >
                {label}
              </Button>
            ))}
          </Stack>

          <Grid container spacing={3}>
            {data.kpis.map(([label, value]) => (
              <Grid item xs={12} sm={6} md={3} key={label}>
                <Card>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Screen Shell
                  </Typography>
                  <Stack spacing={2}>
                    {(view === "notifications" ? notificationLinks : data.cards.map((item) => [item, ""] as const)).map(([item, href], index) => (
                      <Box key={item} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                          <Box>
                            <Typography fontWeight={700}>{item}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Placeholder for API-backed UI in Phase 2/3
                            </Typography>
                          </Box>
                          {href ? (
                            <Button href={href} size="small" variant="outlined">
                              เปิดรายการ
                            </Button>
                          ) : (
                            <Chip label={index % 2 === 0 ? "Ready" : "TBD API"} size="small" />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Status Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Mock readiness
                  </Typography>
                  <LinearProgress variant="determinate" value={68} sx={{ height: 8, borderRadius: 1, mb: 2 }} />
                  <Stack spacing={1}>
                    <Chip icon={<BusinessOutlined />} label="App / Organization aware" />
                    <Chip icon={<AssignmentTurnedInOutlined />} label="Status vocabulary aligned" />
                    <Chip icon={<NotificationsNoneOutlined />} label="Reminder state included" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default SystemMemberShell;
