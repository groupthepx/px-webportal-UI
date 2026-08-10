import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const mobileNavigationSource = readFileSync(
  fileURLToPath(new URL('../src/components/MobileBottomNavigation/index.tsx', import.meta.url)),
  'utf8',
);
const homeSource = readFileSync(
  fileURLToPath(new URL('../src/content/Home/index.tsx', import.meta.url)),
  'utf8',
);

assert.ok(mobileNavigationSource.includes("import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';"));
assert.ok(mobileNavigationSource.includes('icon: <ChatBubbleOutlineRoundedIcon />'));
assert.ok(!mobileNavigationSource.includes('icon: <NotificationsNoneRoundedIcon />'));

assert.ok(homeSource.includes('const missionCardThemes ='));
assert.ok(homeSource.includes("surface: '#fff7ed'"));
assert.ok(homeSource.includes("surface: '#f5f3ff'"));
assert.ok(homeSource.includes("accent: '#ea580c'"));
assert.ok(homeSource.includes("accent: '#7c3aed'"));
assert.ok(homeSource.includes('missionCardThemes.daily'));
assert.ok(homeSource.includes('missionCardThemes.starLive'));
assert.ok(homeSource.includes("import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';"));
assert.ok(homeSource.includes("action: 'affiliate_bonus', icon: PaidOutlinedIcon"));

console.log('mobile message and mission theme tests passed');
