"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Campaign,
  CheckCircle,
  Groups,
  Link as LinkIcon,
  Phone,
  Send,
  WhatsApp,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface RecruitmentApplyProps {
  slug?: string;
  success?: boolean;
}

const appOptions = ["PX Live", "Sugo", "VJ Star Live", "Other"];

function SourceSummary({ slug }: { slug: string }) {
  return (
    <Card sx={{ p: 3, borderRadius: 2, bgcolor: "#FFF8F0" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <LinkIcon color="primary" />
        <Typography variant="h6">Source Link</Typography>
      </Stack>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Referral</Typography>
          <Chip size="small" label={slug || "direct"} />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Campaign</Typography>
          <Typography fontWeight={700}>July VJ Recruitment</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Broker</Typography>
          <Typography fontWeight={700}>TBD / Auto from link</Typography>
        </Stack>
      </Stack>
      <Alert sx={{ mt: 2 }} severity="info">
        ระบบจะเก็บ source, campaign และ referral link ให้อัตโนมัติ
      </Alert>
    </Card>
  );
}

function SuccessView() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}>
        <CheckCircle sx={{ fontSize: 72, color: "success.main", mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          ส่งใบสมัครเรียบร้อยแล้ว
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          ตอนนี้คุณยังเป็นผู้สมัคร VJ อยู่ ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับตามขั้นตอน
        </Typography>
        <Grid container spacing={2}>
          {[
            ["1", "BD Review", "ตรวจข้อมูลและ App ที่สมัคร"],
            ["2", "HR Approval", "อนุมัติหรือแจ้งเหตุผล"],
            ["3", "Training 7 วัน", "ผ่านการฝึกก่อนเข้าเว็บ"],
            ["4", "PX Account", "สร้างหรือเชื่อมบัญชีหลังอนุมัติ"],
          ].map((item) => (
            <Grid key={item[0]} size={{ xs: 12, md: 3 }}>
              <Card variant="outlined" sx={{ p: 2, height: "100%", borderRadius: 2 }}>
                <Chip label={item[0]} color="primary" sx={{ mb: 1 }} />
                <Typography fontWeight={700}>{item[1]}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item[2]}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Alert sx={{ mt: 3, textAlign: "left" }} severity="warning">
          หากข้อมูล LINE ID หรือ WhatsApp ไม่ถูกต้อง อาจทำให้ทีมงานติดต่อกลับล่าช้า
        </Alert>
      </Card>
    </Container>
  );
}

export default function RecruitmentApplyPage({ slug = "direct", success }: RecruitmentApplyProps) {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState("");
  const [pdpa, setPdpa] = useState(false);
  const duplicateWarning = useMemo(() => selectedApp === "Other", [selectedApp]);

  if (success) return <SuccessView />;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F7F8" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Stack spacing={3}>
          <Box>
            <Chip icon={<Campaign />} label="PX VJ Recruitment" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              สมัคร VJ ผ่าน Source Link
            </Typography>
            <Typography color="text.secondary">
              ฟอร์มนี้แยกจาก Register เดิมเพื่อเก็บ source, campaign, broker และ App ที่สมัครก่อนเข้าสู่ระบบ PX VJ
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <SourceSummary slug={slug} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5">ข้อมูลผู้สมัคร</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ผู้สมัครยังไม่ถือเป็น PX VJ Member จนกว่าจะผ่าน Web Admin Approval
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="ชื่อ-นามสกุล" placeholder="กรอกชื่อจริงของผู้สมัคร" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="ชื่อเล่น / ชื่อ VJ" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="เบอร์โทร" InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="WhatsApp phone" InputProps={{ startAdornment: <WhatsApp sx={{ mr: 1 }} /> }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField fullWidth label="LINE ID" placeholder="เช่น px.vj" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>App / บริษัทหลักที่สมัคร</InputLabel>
                        <Select
                          label="App / บริษัทหลักที่สมัคร"
                          value={selectedApp}
                          onChange={(event) => setSelectedApp(event.target.value)}
                        >
                          {appOptions.map((app) => (
                            <MenuItem key={app} value={app}>
                              {app}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {duplicateWarning && (
                    <Alert severity="warning">
                      หากเลือก Other ทีม BD จะต้อง classify App/บริษัทหลักก่อนส่ง HR
                    </Alert>
                  )}
                  <Alert severity="info" icon={<Groups />}>
                    สมัครครั้งแรกเลือกได้ 1 App / บริษัทหลักเท่านั้น หากต้องเพิ่ม App ภายหลังต้องผ่าน BD, HR, Training 7 วัน และ Web Admin อีกครั้ง
                  </Alert>
                  <Divider />
                  <FormControlLabel
                    control={<Switch checked={pdpa} onChange={(event) => setPdpa(event.target.checked)} />}
                    label="ยินยอมให้ PX VJ ติดต่อกลับผ่าน LINE, WhatsApp หรือ App notification ตามขั้นตอนการสมัคร"
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined">บันทึกร่าง</Button>
                    <Button
                      variant="contained"
                      endIcon={<Send />}
                      disabled={!selectedApp || !pdpa}
                      onClick={() => router.push("/apply/success")}
                    >
                      ส่งใบสมัคร
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
