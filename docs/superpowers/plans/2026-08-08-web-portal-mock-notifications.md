# Web Portal Mock Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a frontend-only, reusable mock notification experience to the Web Portal Navbar and the full notifications page.

**Architecture:** Keep notification records in a serializable mock-data module. `Header` owns the temporary read/unread state and passes callbacks to the Navbar menu; the full notifications page owns its own temporary state while consuming the same records. `NotificationMenu` renders every item in a bounded, scrollable MUI menu and routes through `next/navigation`.

**Tech Stack:** Next.js 16, React client components, MUI, TypeScript, `next/navigation`.

## Global Constraints

- This is Mock UI only; do not add notification API calls, FCM, persistence, or Firebase messaging.
- Badge count must use unread items only.
- Each notification must render as an individual item; do not aggregate records by category.
- Existing authentication, gift, coupon, and navigation flows must keep working.
- Use existing light MUI theme and Thai UI copy.

---

### Task 1: Add the shared mock notification contract and records

**Files:**
- Create: `src/mocks/notifications.ts`
- Modify: `src/components/NotificationMenu/index.tsx` (export the shared type if needed)

**Interfaces:**
- Produces `PortalNotification` with `id`, `title`, `description`, `href`, `color`, `iconKey`, `timeLabel`, `category`, and `isRead`.
- Produces `MOCK_PORTAL_NOTIFICATIONS: PortalNotification[]` containing separate records for KYC, withdrawals, orders, angpao, gifts, live, points/bonus, account, article/activity, training, level, recruitment, and close-balance.

- [ ] **Step 1: Create the serializable notification type and mock records**

Use string `iconKey` values instead of React elements so the mock can later be replaced with an API response without changing the UI contract. Include mixed `isRead` values so both states are visible immediately.

- [ ] **Step 2: Verify the record contract locally**

Run: `npx tsc --noEmit --pretty false`

Expected: no TypeScript errors caused by the new module.

### Task 2: Upgrade the Navbar notification menu

**Files:**
- Modify: `src/components/NotificationMenu/index.tsx`
- Modify: `src/components/Header/index.tsx`

**Interfaces:**
- `NotificationMenu` accepts `items`, `onRead`, and `onReadAll` callbacks.
- `Header` initializes a local copy of `MOCK_PORTAL_NOTIFICATIONS`, computes unread count, and passes read callbacks.

- [ ] **Step 1: Render all records with a scrollable menu**

Remove the six-item slice. Add an internal scroll container, unread row styling, unread dot, icon mapping from `iconKey`, `timeLabel`, and an unread summary in the header.

- [ ] **Step 2: Add local read-state interactions**

When an item is clicked, mark that item read before routing to its `href`. Add an `อ่านทั้งหมด` action that marks every local item read. Keep the existing link to `/member/notifications`.

- [ ] **Step 3: Replace the Header’s dynamic notification list with the shared mock list**

Keep coupon/gift API queries intact for their existing controls, but use the shared mock records for the notification bell. The red Badge must display `items.filter((item) => !item.isRead).length`.

- [ ] **Step 4: Check the Navbar states**

Run the app and verify desktop and mobile menus show all records, scroll within the menu, update the Badge after reading, and route to the selected path.

### Task 3: Add the full mock notifications page

**Files:**
- Create: `src/content/MockNotifications/index.tsx`
- Modify: `src/app/member/notifications/page.tsx`

**Interfaces:**
- `MockNotifications` is a client component that consumes `MOCK_PORTAL_NOTIFICATIONS` and locally manages `isRead`.

- [ ] **Step 1: Build the page shell and summary**

Use the existing light MUI theme, responsive `Container`, Thai title/subtitle, summary cards for total and unread, and an `อ่านทั้งหมด` action.

- [ ] **Step 2: Render each record as an independent notification row**

Show the mapped icon, title, description, category, time, unread state, and a route action. Clicking a row marks it read and pushes to the corresponding `href`.

- [ ] **Step 3: Point the route page at the new component**

Replace the generic `SystemMemberShell` placeholder only for `/member/notifications`; do not remove `SystemMemberShell` because other routes may use it.

- [ ] **Step 4: Verify page behavior**

Open `/member/notifications`, confirm all records are shown separately, confirm unread styling changes after opening, and confirm the empty state appears after all are read.

### Task 4: Final verification and handoff notes

**Files:**
- Modify: `docs/superpowers/specs/2026-08-08-web-portal-mock-notifications-design.md` only if verification reveals a contract mismatch.

- [ ] **Step 1: Run project checks**

Run: `npm run lint`

Expected: the project lint command completes without new errors from the notification changes.

- [ ] **Step 2: Run a production build check**

Run: `npm run build`

Expected: the Web Portal build completes, or any pre-existing environment/dependency failure is reported separately from notification code errors.

- [ ] **Step 3: Summarize the backend handoff**

Document that `MOCK_PORTAL_NOTIFICATIONS` is the replacement point, `isRead` is currently local-only, each `href` is a UI deep link, and no endpoint or FCM subscription has been added.
