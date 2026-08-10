# Mobile Message Icon and Mission Card Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เปลี่ยนไอคอนกล่องข้อความบน Mobile Bottom Navigation เป็นไอคอนแชต และแยกสีการ์ดภารกิจรายวัน/ภารกิจ VJ Star Live ให้สื่อความหมายชัดเจน

**Architecture:** ใช้ MUI icon เดิมของโปรเจกต์และกำหนด theme object ขนาดเล็กใน Home component เพื่อให้สีพื้น ขอบ และไอคอนของภารกิจอยู่ในจุดเดียวกัน โดยไม่เปลี่ยน routing หรือ API

**Tech Stack:** Next.js 16, React, MUI 6, TypeScript, Node assertion verifier

## Global Constraints

- ใช้ `ChatBubbleOutlineRoundedIcon` เฉพาะเมนูมือถือ `กล่องข้อความ`
- ไม่เปลี่ยน Notification icon หรือ logic บน Header desktop
- `ภารกิจรายวัน` ใช้พื้นส้มอ่อน ขอบส้ม และไอคอนส้ม
- `ภารกิจ VJ Star Live` ใช้พื้นม่วงอ่อน ขอบม่วง และไอคอนม่วง
- คง interaction เดิมและไม่เพิ่ม API/routing

### Task 1: Verify the requested UI contract

**Files:**
- Test: `scripts/verify-mobile-message-mission-theme.mjs`

- [x] **Step 1: Write the failing test**

ตรวจ import/icon ของ Mobile Bottom Navigation และตรวจ theme tokens ของ mission cards ใน Home

- [x] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-mobile-message-mission-theme.mjs`

Expected: FAIL เพราะ source ยังใช้ `NotificationsNoneRoundedIcon` และยังไม่มี `missionCardThemes`

### Task 2: Change the mobile message icon

**Files:**
- Modify: `src/components/MobileBottomNavigation/index.tsx`

- [ ] **Step 1: Write minimal implementation**

เปลี่ยน import และ icon ของ item เดียว:

```tsx
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

{
  label: 'กล่องข้อความ',
  href: '/member/notifications',
  authOnly: true,
  icon: <ChatBubbleOutlineRoundedIcon />,
}
```

คง route matching และ desktop Header ไว้เหมือนเดิม

- [ ] **Step 2: Run the focused verifier**

Run: `node scripts/verify-mobile-message-mission-theme.mjs`

Expected: ผ่านส่วน mobile icon และหยุดที่ assertion ของ mission theme จนกว่า Task 3 จะเสร็จ

### Task 3: Apply mission card themes

**Files:**
- Modify: `src/content/Home/index.tsx`

- [ ] **Step 1: Define theme tokens**

เพิ่ม object ที่มี `surface`, `border`, `accent`, และ `iconSurface` สำหรับ daily และ star live:

```tsx
const missionCardThemes = {
  daily: { surface: '#fff7ed', border: '#fdba74', accent: '#ea580c', iconSurface: '#ffedd5' },
  starLive: { surface: '#f5f3ff', border: '#c4b5fd', accent: '#7c3aed', iconSurface: '#ede9fe' },
} as const;
```

- [ ] **Step 2: Apply tokens to both cards**

ใช้ `missionCardThemes.daily` กับ Card/Icon ของภารกิจรายวัน และ `missionCardThemes.starLive` กับ Card/Icon ของภารกิจ VJ Star Live โดยให้ selected state ของ star live ใช้ขอบสีม่วงเข้มขึ้น

- [ ] **Step 3: Run the focused verifier**

Run: `node scripts/verify-mobile-message-mission-theme.mjs`

Expected: `mobile message and mission theme tests passed`

### Task 4: Verify the project

**Files:**
- Verify: `src/components/MobileBottomNavigation/index.tsx`
- Verify: `src/content/Home/index.tsx`

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit --pretty false`

Expected: exit code 0

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: exit code 0; baseline-browser-mapping warning is acceptable if no build error occurs

- [ ] **Step 3: Check working tree**

Run: `git diff --check && git status -sb`

Expected: no whitespace error introduced by the two UI changes and only intended files are modified
