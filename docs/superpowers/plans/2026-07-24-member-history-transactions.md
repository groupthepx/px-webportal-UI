# Member History Transactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ปรับหน้า `/member/history` ให้แสดงธุรกรรมแยกตามแอป พร้อมตัวกรองและรองรับรายการคะแนนหลายแหล่ง

**Architecture:** แยกการแปลงข้อมูลและตัวกรองไว้ใน helper ที่ทดสอบได้ แล้วให้ `MemberHistory` ทำหน้าที่โหลดข้อมูลจาก hook, รวมข้อมูล และ render UI เท่านั้น การโหลดประวัติ Coin ต่อแอปใช้ lazy query ตามรายการสังกัดของสมาชิก

**Tech Stack:** Next.js 16, React 18, TypeScript, MUI 6, Redux Toolkit Query, Node built-in test runner สำหรับ pure helper

## Global Constraints

- คงหน้า `/profile/history/[id]` และหน้า history เดิมของแต่ละแอป
- ห้ามใช้ fallback ชื่อ `รวมทุก App`
- ตัวหนังสือและ filter ต้องใช้ MUI theme เดิมของ Web Portal
- หน้าจอเล็กต้องเลื่อนตารางแนวนอนได้ ไม่บีบข้อความให้ผิดรูป
- ถ้า API ใดล้มเหลว ให้แสดงข้อมูล source อื่นต่อและไม่ทำให้ทั้งหน้าล้ม

### Task 1: Transaction data adapter and filters

**Files:**
- Create: `src/content/MemberHistory/transactionHistory.ts`
- Create: `scripts/verify-member-history-logic.mjs`

**Interfaces:**
- `TransactionRow`
- `TransactionFilters`
- `normalizeStatus(value: unknown): TransactionStatus`
- `toTransactionRows(input): TransactionRow[]`
- `filterTransactions(rows, filters): TransactionRow[]`

- [ ] **Step 1: Write the failing test**

เพิ่ม Node test สำหรับพฤติกรรมที่ยังไม่มี:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTransactions, toTransactionRows } from '../src/content/MemberHistory/transactionHistory.ts';

test('keeps every app separate and never labels an item as all apps', () => {
  const rows = toTransactionRows([
    { id: '1', organization_id: 'pati', organization_name: 'Pati', amount: 100 },
    { id: '2', organization_id: 'tiktok', organization_name: 'TikTok', amount: 200 },
  ], { source: 'coin', format: 'Coin PX' });

  assert.deepEqual(rows.map((row) => row.appName), ['Pati', 'TikTok']);
  assert.equal(rows.some((row) => row.appName === 'รวมทุก App'), false);
});

test('filters by app, type, format, and status together', () => {
  const rows = [
    { id: '1', appId: 'pati', appName: 'Pati', type: 'income', format: 'คะแนน', status: 'success', amount: 100 },
    { id: '2', appId: 'tiktok', appName: 'TikTok', type: 'expense', format: 'Coin PX', status: 'rejected', amount: 50 },
  ];

  assert.equal(filterTransactions(rows, { appId: 'pati', type: 'income', format: 'คะแนน', status: 'success' }).length, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: FAIL because the adapter module and filter functions do not exist yet.

- [ ] **Step 3: Write minimal implementation**

สร้าง pure helpers สำหรับ normalize status, แปลงรายการจาก Coin/คะแนนเป็น `TransactionRow`, ป้องกันชื่อแอปว่างด้วย `ไม่ระบุแอป` และกรองเฉพาะ field ที่เลือกแบบ AND

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: PASS with both tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/content/MemberHistory/transactionHistory.ts scripts/verify-member-history-logic.mjs
git commit -m "feat: add member history transaction adapter"
```

### Task 2: Load per-app data and include score sources

**Files:**
- Modify: `src/content/MemberHistory/index.tsx`

**Interfaces:**
- Uses `useLazyGetRewardHistoryQuery`, `useGetMyLivePointsTransactionsQuery`, profile/member queries, and Task 1 helpers
- Produces a combined `TransactionRow[]` for the table

- [ ] **Step 1: Write the failing test**

เพิ่ม test case ใน `scripts/verify-member-history-logic.mjs` ให้ตรวจว่า transaction จากคะแนน Live มี `format: 'คะแนน'`, `type: 'income'` และใช้ชื่อบริษัทจาก payload โดยไม่ตกเป็น `ไม่ระบุแอป` เมื่อมีชื่อบริษัท

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: FAIL because the score adapter is not implemented.

- [ ] **Step 3: Write minimal implementation**

เมื่อได้ `member_organization` แล้วให้เรียก lazy reward history ต่อ organization, map fields ที่มีจำนวนเงินจริง เช่น `amount`, `mission_coin_up`, `coin_up_from_excel`, `transfer_coin_balance` เป็น Coin PX ตาม source และ map Live point transactions เป็นคะแนน รวมข้อมูลทั้งหมดแล้ว sort ใหม่สุดก่อน โดยไม่ให้ error จาก source หนึ่งหยุด source อื่น

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/MemberHistory/index.tsx scripts/verify-member-history-logic.mjs
git commit -m "feat: aggregate member history by app"
```

### Task 3: Add responsive filters and table behavior

**Files:**
- Modify: `src/content/MemberHistory/index.tsx`

- [ ] **Step 1: Write the failing test**

เพิ่ม test ให้ clear filters คืนค่า `all` ทุก field และให้รายการที่ไม่มีข้อมูลหลังกรองไม่ถูก render เป็นแถวธุรกรรม

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: FAIL because clear/filter state behavior is not implemented.

- [ ] **Step 3: Write minimal implementation**

เพิ่ม state สำหรับ app, type, format, status, render Select ตาม MUI theme, ปุ่ม `ล้างตัวกรอง`, คำนวณ options จาก rows จริง, table min-width และ Empty State สำหรับผลลัพธ์ว่าง

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/MemberHistory/index.tsx scripts/verify-member-history-logic.mjs
git commit -m "feat: add member history filters"
```

### Task 4: Verify the Web Portal build and lint

**Files:**
- No new files

- [ ] **Step 1: Run logic test**

Run: `node scripts/verify-member-history-logic.mjs`
Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: exit code 0. Existing unrelated warnings must be reported separately.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: exit code 0 and the `/member/history` route compiles.

- [ ] **Step 4: Review diff**

Run: `git diff --check && git status --short`
Expected: no whitespace errors and only intended MemberHistory/docs files changed.
