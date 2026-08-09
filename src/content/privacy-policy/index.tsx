'use client';

import {
  Box,
  Card,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const overviewCards = [
  {
    icon: <ShieldOutlinedIcon fontSize="small" />,
    title: 'Transparent Collection',
    description: 'เก็บรวบรวมเฉพาะข้อมูลที่จําเป็นต่อการสมัครสมาชิก KYC กระเป๋า PX Points การแลกยอด และการถอนเงิน',
  },
  {
    icon: <LockOutlinedIcon fontSize="small" />,
    title: 'Security Standards',
    description: 'ปกป้องข้อมูลส่วนบุคคล เอกสารยืนยันตัวตน และข้อมูลบัญชีธนาคารด้วยมาตรการที่เหมาะสม',
  },
  {
    icon: <AssuredWorkloadOutlinedIcon fontSize="small" />,
    title: 'Respect for Rights',
    description: 'เปิดช่องทางให้ผู้ใช้งานขอเข้าถึง แก้ไข หรือติดต่อเกี่ยวกับข้อมูลส่วนบุคคลตามหลักเกณฑ์ที่เกี่ยวข้อง',
  },
];

const sectionLinks = [
  { id: 'collection', label: 'ข้อมูลที่เราเก็บรวบรวม' },
  { id: 'usage', label: 'วัตถุประสงค์ในการใช้ข้อมูล' },
  { id: 'disclosure', label: 'การเปิดเผยข้อมูล' },
  { id: 'retention', label: 'การเก็บรักษาและความปลอดภัย' },
  { id: 'rights', label: 'สิทธิของเจ้าของข้อมูล' },
  { id: 'updates', label: 'การปรับปรุงนโยบาย' },
];

const sections = [
  {
    id: 'collection',
    index: '01',
    title: 'ข้อมูลที่เราเก็บรวบรวม',
    body: [
      'ข้อมูลบัญชีผู้ใช้งาน เช่น ชื่อ นามสกุล เบอร์โทรศัพท์ อีเมล ชื่อผู้ใช้ รูปโปรไฟล์ และข้อมูลพื้นฐานที่ใช้สำหรับการสมัครและใช้งานระบบ',
      'ข้อมูล KYC และเอกสารยืนยันตัวตน เช่น ข้อมูลบัตรประชาชน ภาพเอกสาร หรือข้อมูลอื่นที่จำเป็นต่อการตรวจสอบตัวตนก่อนการถอนเงิน',
      'ข้อมูลบัญชีธนาคารและข้อมูลการชำระเงิน เช่น ชื่อบัญชี เลขบัญชี และข้อมูลที่ใช้ประกอบการโอนเงิน เมื่อผู้ใช้งานต้องการถอนยอดคงเหลือ',
      'ข้อมูลกระเป๋า PX Points ประวัติการแลกคะแนน ประวัติการถอนเงิน ประวัติธุรกรรม และสถานะการตรวจสอบหรืออนุมัติรายการ',
      'ข้อมูลกิจกรรมของผู้ใช้งานที่เกิดขึ้นในระบบ PX System และข้อมูลกิจกรรมที่แอดมินได้รับหรือบันทึกจากแพลตฟอร์มภายนอกที่เกี่ยวข้องกับงานของ VJ Members',
    ],
  },
  {
    id: 'usage',
    index: '02',
    title: 'วัตถุประสงค์ในการใช้ข้อมูล',
    body: [
      'เพื่อสร้างและดูแลบัญชีผู้ใช้งาน รวมถึงให้บริการฟีเจอร์ที่เกี่ยวข้องกับกระเป๋า PX Points ประวัติธุรกรรม และสถานะการถอนเงิน',
      'เพื่อยืนยันตัวตน ตรวจสอบคุณสมบัติ KYC และตรวจสอบว่าข้อมูลบัญชีธนาคารตรงกับตัวตนที่ได้รับการยืนยันแล้ว',
      'เพื่อบันทึก คำนวณ หรือแสดง PX Points จากข้อมูลกิจกรรมที่แอดมินอัปโหลด โบนัสจากแอดมิน หรือกิจกรรมที่เข้าเงื่อนไขภายในระบบ',
      'เพื่อพิจารณาการแลก PX Points เป็นยอดถอนเงิน ตรวจสอบความเสี่ยง ป้องกันการทุจริต และตรวจสอบการปฏิบัติตามข้อกำหนดของบริการ',
      'เพื่อสื่อสารกับผู้ใช้งาน สนับสนุนการใช้งาน แจ้งสถานะรายการ และปฏิบัติตามกฎหมายหรือข้อกำหนดของหน่วยงานที่เกี่ยวข้อง',
    ],
  },
  {
    id: 'disclosure',
    index: '03',
    title: 'การเปิดเผยข้อมูล',
    body: [
      'เราอาจเปิดเผยข้อมูลให้แก่บุคลากรภายใน ผู้ดูแลระบบ หรือแอดมินที่มีหน้าที่เกี่ยวข้องกับการตรวจสอบกิจกรรม การพิจารณา KYC การอนุมัติการถอนเงิน และการจัดการธุรกรรม',
      'เราอาจเปิดเผยข้อมูลให้แก่ผู้ให้บริการที่จำเป็นต่อการดำเนินงานของระบบ เช่น ผู้ให้บริการโฮสติ้ง ระบบวิเคราะห์ ระบบจัดเก็บข้อมูล หรือเครื่องมือสื่อสาร โดยจำกัดเท่าที่จำเป็น',
      'ในกรณีการถอนเงิน เราอาจใช้หรือเปิดเผยข้อมูลบัญชีธนาคารและข้อมูลที่เกี่ยวข้องเพื่อดำเนินการโอนเงิน ตรวจสอบรายการ และบันทึกหลักฐานการโอน',
      'ในบางกรณี เราอาจต้องเปิดเผยข้อมูลเพื่อปฏิบัติตามกฎหมาย คำสั่งของหน่วยงานรัฐ หรือเพื่อปกป้องสิทธิ ความปลอดภัย และผลประโยชน์โดยชอบของบริษัทและผู้ใช้งาน',
    ],
  },
  {
    id: 'retention',
    index: '04',
    title: 'การเก็บรักษาและความปลอดภัยของข้อมูล',
    body: [
      'เราจัดเก็บข้อมูลส่วนบุคคล เอกสาร KYC ข้อมูลบัญชีธนาคาร และประวัติธุรกรรมตามระยะเวลาที่จำเป็นต่อการให้บริการ การตรวจสอบย้อนหลัง และตามที่กฎหมายกำหนด',
      'มีการใช้มาตรการด้านเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อช่วยลดความเสี่ยงจากการสูญหาย การเข้าถึงโดยไม่ได้รับอนุญาต การแก้ไขข้อมูลโดยมิชอบ หรือการใช้งานผิดวัตถุประสงค์',
      'ข้อมูลที่เกี่ยวข้องกับการรีวิว KYC การตรวจสอบการถอนเงิน หรือการตรวจสอบความเสี่ยงอาจถูกเก็บรักษาไว้เพื่อใช้ในการพิสูจน์การทำรายการและการป้องกันการทุจริต',
    ],
  },
  {
    id: 'rights',
    index: '05',
    title: 'สิทธิของเจ้าของข้อมูล',
    body: [
      'ผู้ใช้งานมีสิทธิขอเข้าถึง ขอรับสำเนา ขอแก้ไข ขอคัดค้าน หรือขอให้ลบข้อมูลส่วนบุคคลตามสิทธิที่กฎหมายให้ไว้ และภายใต้ข้อจำกัดตามกฎหมายหรือความจำเป็นในการเก็บข้อมูลเพื่อธุรกรรม',
      'หากข้อมูล KYC หรือข้อมูลบัญชีธนาคารไม่ถูกต้อง ผู้ใช้งานสามารถติดต่อเพื่อขอแก้ไขหรือส่งข้อมูลใหม่เพื่อให้การตรวจสอบและการถอนเงินเป็นไปอย่างถูกต้อง',
      'หากต้องการใช้สิทธิดังกล่าว สามารถติดต่อทีมงานผ่านช่องทางที่ระบุไว้ในเว็บไซต์เพื่อให้เราดำเนินการตรวจสอบและตอบกลับ',
    ],
  },
  {
    id: 'updates',
    index: '06',
    title: 'การปรับปรุงนโยบาย',
    body: [
      'เราอาจปรับปรุง Privacy Policy เป็นครั้งคราวเพื่อให้สอดคล้องกับบริการ PX System ขั้นตอน KYC ขั้นตอนการแลก PX Points ขั้นตอนการถอนเงิน กฎหมาย หรือแนวปฏิบัติที่เกี่ยวข้อง',
      'เมื่อมีการเปลี่ยนแปลงที่มีนัยสำคัญ เราจะเผยแพร่เวอร์ชันล่าสุดบนหน้านี้ พร้อมวันที่อัปเดตล่าสุดอย่างชัดเจน',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100%',
        background: 'linear-gradient(180deg, #FCFCFD 0%, #F6F7FB 100%)',
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 3, md: 4.5 }}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FFF7F1 0%, #FFFDFC 100%)',
              border: '1px solid rgba(18,24,38,0.08)',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -80,
                right: -30,
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(241,89,42,0.12) 0%, rgba(241,89,42,0) 72%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -140,
                left: -80,
                width: 360,
                height: 360,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(15,23,42,0.045) 0%, rgba(15,23,42,0) 72%)',
              }}
            />

            <Grid
              container
              spacing={{ xs: 3, md: 4 }}
              sx={{
                position: 'relative',
                zIndex: 1,
                p: { xs: 3, md: 5 },
                alignItems: 'stretch',
              }}
            >
              <Grid size={{ xs: 12, md: 7.5 }}>
                <Stack spacing={3}>
                  <Chip
                    label="Privacy & Legal"
                    sx={{
                      alignSelf: 'flex-start',
                      height: 36,
                      fontWeight: 700,
                      color: theme.colors.primary.dark,
                      backgroundColor: 'rgba(241,89,42,0.1)',
                      border: '1px solid rgba(241,89,42,0.16)',
                      borderRadius: 1.5,
                    }}
                  />

                  <Stack spacing={1.5}>
                    <Typography
                      sx={{
                        maxWidth: 720,
                        fontSize: { xs: 36, md: 56 },
                        fontWeight: 800,
                        lineHeight: 1.02,
                        color: '#111827',
                      }}
                    >
                      Privacy Policy
                    </Typography>
                    <Typography
                      sx={{
                        maxWidth: 700,
                        fontSize: { xs: 16, md: 19 },
                        color: '#4B5563',
                        lineHeight: 1.9,
                      }}
                    >
                      นโยบายความเป็นส่วนตัวนี้อธิบายวิธีที่ The PX Group เก็บรวบรวม ใช้งาน
                      เปิดเผย และดูแลข้อมูลส่วนบุคคลของผู้ใช้งานอย่างโปร่งใส ปลอดภัย
                      และเหมาะสมกับการให้บริการของ PX System รวมถึง KYC กระเป๋า PX Points
                      การแลกคะแนน และการถอนเงิน
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      maxWidth: 640,
                      fontSize: theme.typography.pxToRem(14),
                      fontWeight: 600,
                      color: '#6B7280',
                      lineHeight: 1.85,
                    }}
                  >
                    เราให้ความสำคัญกับความชัดเจนในการจัดการข้อมูล การคุ้มครองความปลอดภัย
                    และสิทธิของผู้ใช้งานในทุกขั้นตอนของการให้บริการ รวมถึงการตรวจสอบ KYC
                    การจัดการข้อมูลธุรกรรม และการดำเนินการถอนเงิน
                  </Typography>

                  <Grid container spacing={1.5}>
                    {['KYC data handling', 'Wallet transaction records', 'User rights support'].map((label) => (
                      <Grid key={label} size={{ xs: 12, sm: 'auto' }}>
                        <Chip
                          label={label}
                          sx={{
                            color: '#1F2937',
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(18,24,38,0.08)',
                            '& .MuiChip-label': { px: 1.5, fontWeight: 600 },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4.5 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    p: { xs: 2.5, md: 3 },
                    height: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(18,24,38,0.08)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 1.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: theme.colors.gradients.primary,
                        color: theme.colors.white.main,
                        boxShadow: '0 12px 24px rgba(241,89,42,0.2)',
                      }}
                    >
                      <DescriptionOutlinedIcon fontSize="small" />
                    </Box>

                    <Stack spacing={0.75}>
                      <Typography
                        variant="overline"
                        sx={{ color: theme.colors.primary.main, fontWeight: 700 }}
                      >
                        Policy Snapshot
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ color: '#111827', lineHeight: 1.35 }}
                      >
                        Essential privacy details for PX System users and stakeholders
                      </Typography>
                    </Stack>

                    <Divider sx={{ borderColor: 'rgba(18,24,38,0.08)' }} />

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <Stack spacing={0.75}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarTodayOutlinedIcon
                              sx={{ fontSize: 18, color: theme.colors.primary.main }}
                            />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Last updated
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#111827' }}>
                            24 Apr 2026
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={6}>
                        <Stack spacing={0.75}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ShieldOutlinedIcon
                              sx={{ fontSize: 18, color: theme.colors.primary.main }}
                            />
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              Standard
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#111827' }}>
                            KYC and Wallet
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        borderRadius: 1.5,
                        px: 2,
                        py: 1.75,
                        backgroundColor: '#F8FAFC',
                        border: '1px solid rgba(18,24,38,0.06)',
                      }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <DescriptionOutlinedIcon
                          sx={{ fontSize: 18, mt: '2px', color: theme.colors.primary.main }}
                        />
                        <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.9 }}>
                          ครอบคลุมข้อมูลบัญชีผู้ใช้งาน ข้อมูล KYC ข้อมูลบัญชีธนาคาร ข้อมูลกิจกรรม
                          ประวัติ PX Points ประวัติการแลกคะแนน และข้อมูลการถอนเงินภายในระบบและบริการของ The PX Group
                        </Typography>
                      </Stack>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.85 }}>
                      PX Points เป็นคะแนนภายในระบบ ผู้ใช้งานไม่สามารถซื้อ PX Points ภายในแอป iOS
                      และไม่สามารถส่ง โอน หรือให้ PX Points แก่ผู้ใช้งานรายอื่นภายในแอปได้
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {overviewCards.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 14px 34px rgba(15, 23, 42, 0.06)',
                    border: '1px solid rgba(18,24,38,0.06)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.5,
                        backgroundColor: '#FFF4ED',
                        color: theme.colors.primary.main,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#111827' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.9 }}>
                      {item.description}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
              <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 16px 38px rgba(15, 23, 42, 0.07)',
                    border: '1px solid rgba(18,24,38,0.06)',
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#111827' }}>
                      On this page
                    </Typography>
                    <List disablePadding>
                      {sectionLinks.map((item) => (
                        <ListItem key={item.id} disableGutters sx={{ py: 0.75 }}>
                          <Box
                            component="a"
                            href={`#${item.id}`}
                            sx={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              textDecoration: 'none',
                              color: '#1F2937',
                              fontSize: theme.typography.pxToRem(14),
                              fontWeight: 600,
                              borderRadius: 1.5,
                              px: 1.5,
                              py: 1.15,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: '#FFF4ED',
                                color: theme.colors.primary.main,
                              },
                            }}
                          >
                            <span>{item.label}</span>
                            <ChevronRightOutlinedIcon fontSize="small" />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Card>

                <Card
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 16px 38px rgba(15, 23, 42, 0.07)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(18,24,38,0.06)',
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#111827' }}>
                      Quick Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.9 }}>
                      เราให้ความสำคัญกับการใช้ข้อมูลอย่างเหมาะสม ชัดเจน และตรวจสอบได้
                      พร้อมคำนึงถึงความปลอดภัยของข้อมูล KYC ธุรกรรมกระเป๋า PX Points
                      และสิทธิของผู้ใช้งานในทุกขั้นตอน
                    </Typography>
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  p: { xs: 3, md: 4 },
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.07)',
                  border: '1px solid rgba(18,24,38,0.06)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Stack spacing={4}>
                  {sections.map((section, index) => (
                    <Box key={section.id} id={section.id} sx={{ scrollMarginTop: 110 }}>
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 2 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: 24, md: 28 },
                              fontWeight: 800,
                              color: theme.colors.primary.main,
                              lineHeight: 1,
                            }}
                          >
                            {section.index}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 10 }}>
                          <Stack spacing={2}>
                            <Typography
                              sx={{
                                fontSize: { xs: 22, md: 28 },
                                fontWeight: 800,
                                lineHeight: 1.25,
                                color: '#162033',
                              }}
                            >
                              {section.title}
                            </Typography>
                            <Stack spacing={1.5}>
                              {section.body.map((paragraph) => (
                                <Box
                                  key={paragraph}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.25,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      mt: '10px',
                                      flexShrink: 0,
                                      backgroundColor: theme.colors.primary.main,
                                    }}
                                  />
                                  <Typography variant="body1" color="text.secondary" lineHeight={1.95}>
                                    {paragraph}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                      {index !== sections.length - 1 && <Divider sx={{ mt: 4 }} />}
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Card
            sx={{
              borderRadius: 2,
              p: { xs: 3, md: 4 },
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.07)',
              border: '1px solid rgba(18,24,38,0.06)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFF4ED',
                      color: theme.colors.primary.main,
                    }}
                  >
                    <ContactMailOutlinedIcon fontSize="small" />
                  </Box>
                  <Typography variant="h6" fontWeight={800}>
                    Contact for Privacy Requests
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="body1" color="text.secondary" lineHeight={1.95}>
                  หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว การเข้าถึงข้อมูล การแก้ไขข้อมูล
                  ข้อมูล KYC ข้อมูลบัญชีธนาคาร หรือการใช้สิทธิในข้อมูลส่วนบุคคล กรุณาติดต่อทีมงานผ่านช่องทางติดต่อที่แสดงในเว็บไซต์ของ
                  The PX Group เพื่อให้เราดำเนินการตรวจสอบและตอบกลับอย่างเหมาะสม
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
