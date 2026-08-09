'use client';

import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { alpha, Avatar, Box, Button, Card, CardContent, Checkbox, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Stack, Typography, Zoom, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';

import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { decrypt, encrypt } from '@/utils/encryption';
import { getMemberApplications } from '@/content/Home/homeData';
import { buildExamAnswerReview, formatExamAnswer, type ExamReviewQuestion } from './examReview';

type ExamResult = 'ready' | 'passed' | 'failed';
type Question = ExamReviewQuestion;

const MAX_ATTEMPTS = 3;
const PASS_SCORE = 4;

const questions: Question[] = [
  { id: 'q1', title: 'ก่อนเริ่ม Live ควรเตรียมตัวอย่างไร', type: 'single', options: ['ตรวจสอบอุปกรณ์และอินเทอร์เน็ต', 'เริ่ม Live ทันที', 'ไม่ต้องเตรียมตัว'], answer: 'ตรวจสอบอุปกรณ์และอินเทอร์เน็ต' },
  { id: 'q2', title: 'ข้อใดเป็นแนวทางการทำงานที่เหมาะสม', type: 'multiple', options: ['สุภาพกับผู้ชม', 'ตรวจสอบข้อมูลก่อนสื่อสาร', 'แชร์รหัสผ่านให้ผู้อื่น', 'รักษาความเป็นส่วนตัวของผู้ชม'], answer: ['สุภาพกับผู้ชม', 'ตรวจสอบข้อมูลก่อนสื่อสาร', 'รักษาความเป็นส่วนตัวของผู้ชม'] },
  { id: 'q3', title: 'เมื่อพบปัญหาระหว่างการทำงาน ควรแจ้งทีมงานตามช่องทางที่กำหนด', type: 'true_false', options: ['ถูก', 'ผิด'], answer: 'ถูก' },
  { id: 'q4', title: 'ข้อใดช่วยให้การทำงานมีคุณภาพมากขึ้น', type: 'single', options: ['เรียนรู้แนวทางของ App และทบทวนบทเรียน', 'ข้ามขั้นตอนสำคัญ', 'หยุดทำตามเงื่อนไขของระบบ'], answer: 'เรียนรู้แนวทางของ App และทบทวนบทเรียน' },
  { id: 'q5', title: 'เมื่อทำบทเรียนครบทุกหัวข้อแล้ว ระบบควรเปิดให้เข้าสอบ', type: 'true_false', options: ['ถูก', 'ผิด'], answer: 'ถูก' },
];

function decodeRouteValue(value?: string) {
  if (!value) return '';
  try {
    return String(decrypt(decodeURIComponent(value)));
  } catch {
    return decodeURIComponent(value);
  }
}

export default function TrainingExam({ appId, lessonId }: { appId: string; lessonId: string }) {
  const theme = useTheme();
  const decodedAppId = useMemo(() => decodeRouteValue(appId), [appId]);
  const decodedLessonId = useMemo(() => decodeRouteValue(lessonId), [lessonId]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result, setResult] = useState<ExamResult>('ready');
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [answerReview, setAnswerReview] = useState<ReturnType<typeof buildExamAnswerReview>>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [message, setMessage] = useState('');
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const application = getMemberApplications(memberResponse?.data).find((item) => item.id === decodedAppId);

  const submitExam = () => {
    const isAnswered = questions.every((question) => {
      const answer = answers[question.id];
      return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
    });
    if (!isAnswered) {
      setMessage('กรุณาตอบคำถามให้ครบทุกข้อก่อนส่งคำตอบ');
      return;
    }
    setMessage('');
    setConfirmOpen(true);
  };

  const confirmSubmitExam = () => {
    const nextAttemptsUsed = attemptsUsed + 1;
    const nextReview = buildExamAnswerReview(questions, answers);
    const nextScore = nextReview.filter((item) => item.correct).length;
    setAttemptsUsed(nextAttemptsUsed);
    setScore(nextScore);
    setAnswerReview(nextReview);
    setResult(nextScore >= PASS_SCORE ? 'passed' : 'failed');
    setShowSummary(true);
    setConfirmOpen(false);
  };

  const retryExam = () => {
    setAnswers({});
    setScore(null);
    setAnswerReview([]);
    setResult('ready');
    setShowSummary(false);
    setMessage('');
  };

  if (profileLoading || (memberId !== '0' && memberLoading)) {
    return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  const attemptsRemaining = Math.max(MAX_ATTEMPTS - attemptsUsed, 0);
  const examOverviewHref = `/member/training/${encodeURIComponent(encrypt(decodedAppId))}/exams`;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={2.25}>
          <Stack direction="row" alignItems="center">
            <Button href={examOverviewHref} variant="text" startIcon={<ArrowBackRoundedIcon />} sx={{ px: 0.5, color: theme.colors.gray.main, fontSize: 12.5 }}>กลับไปหน้าข้อสอบทั้งหมด</Button>
          </Stack>
          <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid rgba(15,23,42,.08)' }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar src={application?.logo || undefined} sx={{ width: 48, height: 48, bgcolor: alpha(theme.colors.primary.main, .12), color: theme.colors.primary.main }}>{application?.name?.slice(0, 1) || 'A'}</Avatar>
                  <Box><Typography sx={{ color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ข้อสอบประจำบทเรียน</Typography><Typography sx={{ mt: .3, color: theme.colors.gray.main, fontSize: 13 }}>{application?.name || 'App ของคุณ'} · บทเรียน {decodedLessonId || '1'}</Typography></Box>
                </Stack>
                <Chip icon={result === 'passed' ? <CheckCircleRoundedIcon /> : result === 'failed' ? <ErrorOutlineRoundedIcon /> : <AssignmentTurnedInOutlinedIcon />} label={result === 'passed' ? 'สอบผ่าน' : result === 'failed' ? 'สอบไม่ผ่าน' : 'พร้อมสอบ'} sx={{ color: result === 'passed' ? '#16a34a' : result === 'failed' ? '#dc2626' : '#d97706', bgcolor: result === 'passed' ? '#ecfdf3' : result === 'failed' ? '#fef2f2' : '#fff7ed', fontWeight: 700 }} />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                <Chip size="small" label={`${questions.length} ข้อ`} />
                <Chip size="small" label={`ผ่านเมื่อได้ ${PASS_SCORE} คะแนน`} />
                <Chip size="small" label={`เหลือสิทธิ์ ${attemptsRemaining}/${MAX_ATTEMPTS} ครั้ง`} />
              </Stack>
              <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography sx={{ color: theme.colors.gray.main, fontSize: 12.5, lineHeight: 1.6 }}>หน้าข้อสอบนี้เป็น UI จำลองตามเงื่อนไข Admin ปัจจุบัน ก่อนเชื่อม API จริง ระบบจริงควรเปิดหน้านี้เมื่อเรียนครบทุกหัวข้อของบทเรียนแล้วเท่านั้น</Typography>
              </Box>
            </CardContent>
          </Card>

          {showSummary ? (
            <Stack spacing={1.5}>
              {result === 'passed' ? (
                <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4' }}><CardContent sx={{ p: 3, textAlign: 'center' }}><CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 50 }} /><Typography sx={{ mt: 1, color: '#166534', fontSize: 22, fontWeight: 800 }}>สอบผ่านแล้ว</Typography><Typography sx={{ mt: .5, color: '#15803d', fontSize: 14 }}>คะแนน {score}/{questions.length} · ระบบจะบันทึกผลเมื่อเชื่อมต่อ Backend</Typography></CardContent></Card>
              ) : (
                <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #fecaca', bgcolor: '#fff7f7' }}><CardContent sx={{ p: 3, textAlign: 'center' }}>{attemptsRemaining === 0 ? <LockOutlinedIcon sx={{ color: '#dc2626', fontSize: 48 }} /> : <ErrorOutlineRoundedIcon sx={{ color: '#dc2626', fontSize: 48 }} />}<Typography sx={{ mt: 1, color: '#991b1b', fontSize: 21, fontWeight: 800 }}>{attemptsRemaining === 0 ? 'หมดสิทธิ์สอบบทเรียนนี้' : 'สอบไม่ผ่าน'}</Typography><Typography sx={{ mt: .5, color: '#b91c1c', fontSize: 14 }}>คะแนนครั้งล่าสุด {score}/{questions.length}{attemptsRemaining === 0 ? ' กรุณาติดต่อผู้ดูแลเพื่อขอพิจารณาเพิ่มเติม' : ` · ยังเหลือสิทธิ์สอบอีก ${attemptsRemaining} ครั้ง`}</Typography></CardContent></Card>
              )}
              {result === 'passed' && <Button fullWidth variant="outlined" startIcon={<ListAltOutlinedIcon />} href={examOverviewHref} sx={{ color: theme.colors.gray.main, fontWeight: 700 }}>ดูข้อสอบทั้งหมด</Button>}
              {result === 'failed' && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {attemptsRemaining > 0 && <Button fullWidth variant="outlined" startIcon={<ReplayRoundedIcon />} onClick={retryExam}>สอบใหม่</Button>}
                <Button fullWidth variant="text" color="inherit" startIcon={<ListAltOutlinedIcon />} href={examOverviewHref} sx={{ color: theme.colors.gray.main, fontWeight: 700 }}>ดูข้อสอบทั้งหมด</Button>
              </Stack>}
            </Stack>
          ) : (
            <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid rgba(15,23,42,.08)' }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={2.5}>
                  {questions.map((question, index) => (
                    <Box key={question.id}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Typography sx={{ color: theme.colors.black.main, fontSize: 15, fontWeight: 800 }}>{index + 1}. {question.title}</Typography>
                        <Chip size="small" label={question.type === 'multiple' ? 'เลือกหลายข้อ' : question.type === 'true_false' ? 'ถูก / ผิด' : 'เลือก 1 ข้อ'} sx={{ height: 22, fontSize: 10.5, color: theme.colors.primary.main, bgcolor: alpha(theme.colors.primary.main, .08) }} />
                      </Stack>
                      <FormControl sx={{ mt: .75, width: '100%' }}>
                        {question.type === 'multiple' ? (
                          <FormGroup>
                            {question.options.map((option) => {
                              const selected = Array.isArray(answers[question.id]) && answers[question.id].includes(option);
                              return <FormControlLabel key={option} control={<Checkbox size="small" checked={selected} onChange={(event) => setAnswers((current) => {
                                const previous = Array.isArray(current[question.id]) ? current[question.id] as string[] : [];
                                const next = event.target.checked ? [...previous, option] : previous.filter((value) => value !== option);
                                return { ...current, [question.id]: next };
                              })} />} label={<Typography sx={{ fontSize: 13 }}>{option}</Typography>} />;
                            })}
                          </FormGroup>
                        ) : (
                          <RadioGroup value={typeof answers[question.id] === 'string' ? answers[question.id] : ''} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}>
                            {question.options.map((option) => <FormControlLabel key={option} value={option} control={<Radio size="small" />} label={<Typography sx={{ fontSize: 13 }}>{option}</Typography>} />)}
                          </RadioGroup>
                        )}
                      </FormControl>
                      {index < questions.length - 1 && <Divider sx={{ mt: 1.75 }} />}
                    </Box>
                  ))}
                  {message && <Typography sx={{ color: '#dc2626', fontSize: 13, fontWeight: 700 }}>{message}</Typography>}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button fullWidth variant="contained" startIcon={<AssignmentTurnedInOutlinedIcon />} onClick={submitExam}>ส่งคำตอบ</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {result !== 'ready' && answerReview.length > 0 && (
            <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid rgba(15,23,42,.08)' }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={1.75}>
                  <Box>
                    <Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>สรุปคำตอบหลังสอบ</Typography>
                    <Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 13 }}>ตรวจสอบได้ว่าข้อไหนถูกหรือผิด พร้อมคำตอบที่ถูกต้อง</Typography>
                  </Box>
                  {answerReview.map((review, index) => (
                    <Box key={review.questionId} sx={{ p: 1.5, borderRadius: 1.75, border: '1px solid', borderColor: review.correct ? '#bbf7d0' : '#fecaca', bgcolor: review.correct ? '#f0fdf4' : '#fff7f7' }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {review.correct ? <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 20 }} /> : <ErrorOutlineRoundedIcon sx={{ color: '#dc2626', fontSize: 20 }} />}
                          <Typography sx={{ color: theme.colors.black.main, fontSize: 14, fontWeight: 800 }}>ข้อ {index + 1}. {review.questionTitle}</Typography>
                        </Stack>
                        <Chip size="small" label={review.correct ? 'ตอบถูก' : 'ตอบผิด'} sx={{ color: review.correct ? '#166534' : '#991b1b', bgcolor: review.correct ? '#dcfce7' : '#fee2e2', fontWeight: 700 }} />
                      </Stack>
                      <Stack spacing={0.35} sx={{ mt: 1, pl: { sm: 3.5 } }}>
                        <Typography sx={{ color: '#475467', fontSize: 13 }}>คำตอบของคุณ: <Box component="span" sx={{ color: review.correct ? '#166534' : '#991b1b', fontWeight: 700 }}>{formatExamAnswer(review.selected)}</Box></Typography>
                        <Typography sx={{ color: '#475467', fontSize: 13 }}>คำตอบที่ถูกต้อง: <Box component="span" sx={{ color: '#166534', fontWeight: 700 }}>{formatExamAnswer(review.correctAnswer)}</Box></Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        TransitionComponent={Zoom}
        transitionDuration={{ enter: 420, exit: 220 }}
        fullWidth
        maxWidth="xs"
        sx={{ '& .MuiBackdrop-root': { backdropFilter: 'blur(4px)', bgcolor: 'rgba(15,23,42,.48)' } }}
        PaperProps={{ sx: { overflow: 'hidden', borderRadius: 3 } }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 2.25, color: '#fff', textAlign: 'center', background: theme.colors.gradients.primary }}>
          <Box sx={{ mx: 'auto', display: 'grid', placeItems: 'center', width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.2)', boxShadow: '0 0 0 10px rgba(255,255,255,.08)', animation: 'examConfirmPulse 1.8s ease-in-out infinite', '@keyframes examConfirmPulse': { '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(255,255,255,.08)' }, '50%': { transform: 'scale(1.08)', boxShadow: '0 0 0 16px rgba(255,255,255,.02)' } } }}>
            <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography sx={{ mt: 2, fontSize: 22, fontWeight: 900 }}>พร้อมส่งคำตอบแล้วหรือยัง?</Typography>
          <Typography sx={{ mt: .5, color: 'rgba(255,255,255,.86)', fontSize: 13 }}>การยืนยันครั้งนี้จะนับเป็นการสอบ 1 ครั้ง</Typography>
        </Box>
        <DialogTitle sx={{ pb: 0, fontSize: 18, fontWeight: 800 }}>ยืนยันการส่งข้อสอบ</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.colors.gray.main, fontSize: 14, lineHeight: 1.7 }}>ตรวจสอบคำตอบครบแล้วใช่ไหม เมื่อยืนยันแล้วระบบจะสรุปผลการสอบ พร้อมแสดงข้อที่ตอบถูกและตอบผิดให้ตรวจสอบทันที</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.75 }}>
            <Chip size="small" label={`${questions.length} ข้อ`} sx={{ fontWeight: 700, bgcolor: '#fff7ed', color: '#c2410c' }} />
            <Chip size="small" label={`เหลือสิทธิ์ ${attemptsRemaining}/${MAX_ATTEMPTS} ครั้ง`} sx={{ fontWeight: 700, bgcolor: '#f8fafc' }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button fullWidth variant="outlined" onClick={() => setConfirmOpen(false)}>ตรวจสอบอีกครั้ง</Button>
          <Button fullWidth variant="contained" onClick={confirmSubmitExam} sx={{ background: theme.colors.gradients.primary, '&:hover': { background: theme.colors.gradients.primary } }}>ยืนยันส่งข้อสอบ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
