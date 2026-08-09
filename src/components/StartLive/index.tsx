"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  Close,
  HistoryOutlined,
  SensorsOutlined,
  OpenInNewRounded,
  StopCircleOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { extractApiError } from "@/utils/extractApiError";
import { useGetProfileByIdQuery } from "@/lib/features/profile";
import {
  useCreateLiveSessionMutation,
  useGetMyLiveSessionsQuery,
  useEndLiveSessionMutation,
  useGetLiveRewardInfoQuery,
} from "@/lib/features/live-session";

const GRADIENT = "linear-gradient(135deg,#EEA15D 0%,#F1592A 55%,#9F3025 100%)";
const isValidUrl = (u: string) => /^https?:\/\/.+/i.test((u || "").trim());

// Ticking mm:ss countdown seeded from the SERVER's remaining seconds (not the
// browser clock) — a skewed device can no longer show 00:00 while time is
// actually left. Re-seeds whenever the polled value changes; ticks down locally
// in between so it stays smooth.
function useCountdown(remainingSeconds?: number) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (remainingSeconds == null) { setLeft(0); return; }
    setLeft(Math.max(0, Math.floor(remainingSeconds)));
    const t = setInterval(() => setLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [remainingSeconds]);
  return `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
}

export default function StartLive({
  variant = "button",
  fullWidth = false,
  sx,
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  initialOrganizationId = "",
}: {
  variant?: "button" | "icon";
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  initialOrganizationId?: string;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [organizationId, setOrganizationId] = useState(initialOrganizationId);
  const [liveLink, setLiveLink] = useState("");
  const [note, setNote] = useState("");

  const open = openProp ?? internalOpen;
  const setDialogOpen = (nextOpen: boolean) => {
    setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const { data: profileRes } = useGetProfileByIdQuery();
  const { data: myLivesRes } = useGetMyLiveSessionsQuery(undefined, { pollingInterval: 30000 });
  const [createLive, { isLoading }] = useCreateLiveSessionMutation();
  const [endLive, { isLoading: isEnding }] = useEndLiveSessionMutation();

  const orgs = useMemo(
    () => (profileRes?.data?.member_organization ?? []).filter((o: any) => o.is_active && o.organization),
    [profileRes]
  );
  const selectedOrg = useMemo(() => orgs.find((o: any) => String(o.organization_id) === String(organizationId)), [orgs, organizationId]);

  // Currently-live session (if any) — drives the "already live" UX.
  const activeLive = useMemo(() => (myLivesRes?.data ?? []).find((s: any) => s.is_live), [myLivesRes]);
  const triggerCountdown = useCountdown(activeLive?.time_remaining_seconds);

  const { data: rewardRes } = useGetLiveRewardInfoQuery({ organization_id: organizationId }, { skip: !organizationId });
  const reward = rewardRes?.data;
  const coin = reward?.coin_per_live as number | undefined;
  const liveEnabled = reward ? reward.live_enabled !== false : true;

  // Remember the latest link per Application so VJs do not need to paste the
  // same stream URL every time. Switching Application loads that app's saved link.
  useEffect(() => {
    setLiveLink(selectedOrg?.live_link?.trim() || "");
  }, [organizationId, selectedOrg?.live_link]);

  const linkError = liveLink.trim().length > 0 && !isValidUrl(liveLink);

  const handleSubmit = async () => {
    if (!organizationId) return enqueueSnackbar("กรุณาเลือกสังกัด / Application", { variant: "warning" });
    if (!selectedOrg?.user_id) return enqueueSnackbar("ยังไม่มี App User ID ในแอปนี้ กรุณาติดต่อแอดมิน", { variant: "warning" });
    if (!liveLink.trim()) return enqueueSnackbar("กรุณากรอก Live Link", { variant: "warning" });
    if (!isValidUrl(liveLink)) return enqueueSnackbar("Live Link ต้องเป็น URL ที่ขึ้นต้นด้วย http(s)://", { variant: "warning" });
    try {
      const res = await createLive({ organization_id: organizationId, live_link: liveLink.trim(), note }).unwrap();
      enqueueSnackbar(res?.message || "ยืนยันขึ้นไลฟ์สำเร็จ", { variant: "success" });
      setNote("");
      setDialogOpen(false);
      router.push("/home/live_history");
    } catch (e: any) {
      enqueueSnackbar(extractApiError(e, "ยืนยันขึ้นไลฟ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"), { variant: "error" });
    }
  };

  const handleEnd = async () => {
    if (!activeLive) return;
    // Ending before the window fully elapses forfeits the points — warn loudly
    // with the real time left (from the server) so nobody quits a minute early.
    const remain = Math.max(0, Math.floor(activeLive.time_remaining_seconds ?? 0));
    if (remain > 0) {
      const mm = String(Math.floor(remain / 60)).padStart(2, "0");
      const ss = String(remain % 60).padStart(2, "0");
      if (!window.confirm(`⚠️ ยังเหลือเวลาอีก ${mm}:${ss}\nถ้าจบไลฟ์ตอนนี้จะไม่ได้รับคะแนน\n\nต้องการจบไลฟ์เลยหรือไม่?`)) return;
    }
    try {
      await endLive({ id: activeLive.live_session_id }).unwrap();
      enqueueSnackbar("จบไลฟ์เรียบร้อย", { variant: "success" });
    } catch (e: any) {
      enqueueSnackbar(extractApiError(e, "จบไลฟ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"), { variant: "error" });
    }
  };

  // ── Trigger (header button/icon) — reflects "กำลังไลฟ์" state ──
  const trigger =
    variant === "icon" ? (
      <IconButton color="error" onClick={() => setDialogOpen(true)} aria-label="Start Live">
        <SensorsOutlined sx={activeLive ? { animation: "pxPulse 1.3s infinite", "@keyframes pxPulse": { "50%": { opacity: 0.4 } } } : undefined} />
      </IconButton>
    ) : (
      <Button
        variant="contained"
        color="error"
        fullWidth={fullWidth}
        startIcon={<SensorsOutlined />}
        onClick={() => setDialogOpen(true)}
        sx={{ fontWeight: 800, borderRadius: 999, background: activeLive ? undefined : GRADIENT, ...sx }}
      >
        {activeLive ? `กำลังไลฟ์ · ${triggerCountdown}` : "ยืนยันขึ้นไลฟ์"}
      </Button>
    );

  return (
    <>
      {!hideTrigger && trigger}

      <Dialog open={open} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden", boxShadow: "none" } }}>
        <Box sx={{ color: "text.primary", px: 3, py: 2.2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <SensorsOutlined sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{activeLive ? "คุณกำลังไลฟ์อยู่" : "ยืนยันขึ้นไลฟ์"}</Typography>
          </Stack>
          <IconButton onClick={() => setDialogOpen(false)} aria-label="ปิด"><Close /></IconButton>
        </Box>

        <DialogContent sx={{ pt: 3 }}>
          {activeLive ? (
            // ── Already-live panel ──
            <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
              <Chip label="🔴 กำลังไลฟ์" sx={{ bgcolor: "#fee2e2", color: "#dc2626", fontWeight: 900 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{activeLive.organization?.company_name || "-"}</Typography>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">เหลือเวลา Monitoring</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, color: "#dc2626" }}>⏱ {triggerCountdown}</Typography>
              </Box>
              <Button fullWidth variant="contained" color="error" startIcon={<StopCircleOutlined />} disabled={isEnding} onClick={handleEnd} sx={{ borderRadius: 2, py: 1.2, fontWeight: 800 }}>
                จบไลฟ์
              </Button>
              <Button fullWidth variant="text" startIcon={<HistoryOutlined />} onClick={() => { setDialogOpen(false); router.push("/home/live_history"); }}>
                ดูประวัติการขึ้นไลฟ์
              </Button>
            </Stack>
          ) : (
            // ── Create form ──
            <>
              <Stack spacing={2}>
                <TextField select fullWidth label="Application / สังกัด" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
                  {orgs.length === 0 && <MenuItem value="" disabled>ไม่พบสังกัดที่ใช้งานอยู่</MenuItem>}
                  {orgs.map((o: any) => (
                    <MenuItem key={o.organization_id} value={o.organization_id}>{o.organization?.company_name}</MenuItem>
                  ))}
                </TextField>

                {organizationId && !liveEnabled && (
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fff7ed", color: "#c2410c", fontSize: 13 }}>
                    ⚠️ แอปนี้ปิดรับการยืนยันขึ้นไลฟ์ชั่วคราว
                  </Box>
                )}

                {organizationId && liveEnabled && coin != null && (
                  <Box sx={{ p: 1.4, borderRadius: 2, bgcolor: "#f0f7ff", border: "1px solid #d6e8ff", color: "#1e3a8a", fontSize: 13, lineHeight: 1.7 }}>
                    🏆 ไลฟ์ครบ <b>{reward?.display_timeout_minutes ?? 30} นาที</b> รับ <b>{coin} คะแนน</b><br />
                    หากจบก่อนครบเวลาจะ<b>ไม่ได้รับคะแนน</b> · คะแนนเป็นระบบแยก ไม่เข้ากระเป๋า PX Coin
                  </Box>
                )}

                <TextField fullWidth label="App User ID" value={selectedOrg?.user_id || ""} InputProps={{ readOnly: true }} helperText="ดึงอัตโนมัติจากสังกัดที่เลือก" />

                <Box>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth label="Live Link" value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      placeholder="https://... (ลิงก์ที่กำลังไลฟ์ เช่น TikTok / Telegram)"
                      error={linkError}
                      helperText={linkError ? "ต้องเป็น URL ขึ้นต้น http(s)://" : "ระบบจะจำลิงก์ล่าสุดของสังกัดนี้จนกว่าคุณจะเปลี่ยน"}
                    />
                    <IconButton
                      aria-label="เปิดลิงก์ทดสอบ"
                      disabled={!isValidUrl(liveLink)}
                      onClick={() => window.open(liveLink, "_blank")}
                      sx={{ mt: 1 }}
                    >
                      <OpenInNewRounded />
                    </IconButton>
                  </Stack>
                </Box>

                <TextField fullWidth multiline minRows={2} label="หมายเหตุ (ไม่บังคับ)" value={note} onChange={(e) => setNote(e.target.value)} />
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Button fullWidth variant="text" color="inherit" startIcon={<HistoryOutlined />} onClick={() => { setDialogOpen(false); router.push("/home/live_history"); }} sx={{ justifyContent: "flex-start" }}>
                ดูประวัติการขึ้นไลฟ์ทั้งหมด
              </Button>
            </>
          )}
        </DialogContent>

        {!activeLive && (
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              fullWidth
              variant="text"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading || !liveEnabled}
              sx={{ fontWeight: 800, borderRadius: 2, py: 1.3 }}
            >
              {isLoading ? <CircularProgress size={22} /> : `🔴 ยืนยันขึ้นไลฟ์${coin != null ? ` · สิทธิ์รับ ${coin} คะแนน` : ""}`}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
