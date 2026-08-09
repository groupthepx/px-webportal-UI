const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const contains = (file, text) => read(file).includes(text);

const checks = [
  ['login home renders KYC state', contains('src/content/Home/index.tsx', 'สถานะ KYC')],
  ['login home renders VJ Star Live mission progress', contains('src/content/Home/index.tsx', 'ภารกิจ VJ Star Live')],
  ['public home removes app chooser', !contains('src/content/public-home-v2/index.tsx', 'Choose your app')],
  ['notification menu is part of header', contains('src/components/Header/index.tsx', 'NotificationMenu')],
  ['mini app has live confirmation dialog', contains('src/content/MiniApp/index.tsx', 'Dialog')],
  ['angpao has a full page route', contains('src/app/member/angpao/page.tsx', 'AngpaoPage')],
  ['training starts with app selection', contains('src/app/member/training/page.tsx', 'TrainingAppSelection')],
  ['profile uses settings layout', contains('src/app/profile/page.tsx', 'ProfileSettings')],
  ['register success copy is updated', contains('src/content/RegisterSuccess/index.tsx', 'ขอบคุณสำหรับความสนใจเข้าร่วมครอบครัว PX')],
];

const failed = checks.filter(([, passed]) => !passed);
for (const [name, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
