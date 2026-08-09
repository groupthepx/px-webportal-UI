import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { LOGIN_SUCCESS_ROUTE } from '../src/content/login/loginRedirect.ts';
import { getAppShortcutDestination } from '../src/content/Home/shortcutRouting.ts';
import { getLiveShortcutAppId, toggleMissionView } from '../src/content/Home/homeInteractions.ts';
import { buildExamAnswerReview } from '../src/content/TrainingExam/examReview.ts';

assert.equal(LOGIN_SUCCESS_ROUTE, '/home');

assert.deepEqual(getAppShortcutDestination('training', ['app-1']), {
  mode: 'direct',
  appId: 'app-1',
});
assert.deepEqual(getAppShortcutDestination('affiliate_bonus', ['app-1', 'app-2']), {
  mode: 'select',
  href: '/member/profile',
});
assert.equal(getLiveShortcutAppId(['app-1']), 'app-1');
assert.equal(getLiveShortcutAppId(['app-1', 'app-2']), undefined);
assert.equal(toggleMissionView('none', 'star_live'), 'star_live');
assert.equal(toggleMissionView('star_live', 'star_live'), 'none');

const homeSource = readFileSync(fileURLToPath(new URL('../src/content/Home/index.tsx', import.meta.url)), 'utf8');
assert.ok(homeSource.indexOf('>ภารกิจของคุณ</Typography>') < homeSource.indexOf('>ทางลัดการใช้งาน</Typography>'));
assert.ok(homeSource.includes('useGetMyLivePointsQuery'));
assert.ok(homeSource.includes("label: 'คะแนนที่ใช้ได้'"));
assert.ok(homeSource.includes("href: '/px_market'"));

const examSource = readFileSync(fileURLToPath(new URL('../src/content/TrainingExam/index.tsx', import.meta.url)), 'utf8');
assert.ok(examSource.includes('TransitionComponent={Zoom}'));
assert.ok(examSource.includes('ดูข้อสอบทั้งหมด'));
assert.ok(examSource.includes('กลับไปหน้าข้อสอบทั้งหมด'));
assert.ok(examSource.includes("result === 'passed' && <Button"));

const review = buildExamAnswerReview(
  [
    { id: 'single', title: 'ข้อเดียว', type: 'single', options: ['ก', 'ข'], answer: 'ก' },
    { id: 'multiple', title: 'หลายข้อ', type: 'multiple', options: ['ก', 'ข', 'ค'], answer: ['ก', 'ค'] },
    { id: 'true-false', title: 'ถูกผิด', type: 'true_false', options: ['ถูก', 'ผิด'], answer: 'ถูก' },
  ],
  {
    single: 'ก',
    multiple: ['ค', 'ก'],
    'true-false': 'ผิด',
  },
);

assert.deepEqual(review.map((item) => item.correct), [true, true, false]);
assert.deepEqual(review[1].selected, ['ค', 'ก']);
assert.equal(review[2].correctAnswer, 'ถูก');

console.log('latest feedback tests passed');
