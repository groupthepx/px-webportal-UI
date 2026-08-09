# Web Portal Mock Notifications

## Goal

Provide a frontend-only notification experience that gives the integration team a stable UI contract before the notification API is connected.

## Scope

- Add a shared mock notification dataset in one file.
- Show every mock notification as a separate item in the Navbar menu.
- Show an unread badge on the Navbar bell using unread items only.
- Mark an item as read when it is opened.
- Provide an "อ่านทั้งหมด" action for the local mock state.
- Link each notification to the related Web Portal route.
- Reuse the same dataset in `/member/notifications`.

## UI States

- Empty: show a clear no-notifications message.
- Unread: warm highlighted row, unread dot, and unread badge count.
- Read: neutral row without the unread indicator.
- Long list: keep the Navbar menu bounded with internal scrolling; do not hide items with a display limit.
- Mobile: constrain the menu to the viewport and keep each notification easy to tap.

## Mock Data Contract

Each notification has an `id`, `title`, `description`, `href`, `color`, `iconKey`, `timeLabel`, `category`, and `isRead` field. The `iconKey` is intentionally a serializable string so the eventual API response can replace the mock data without transporting React elements.

The dataset covers the current and planned notification categories: KYC, withdrawal, order, angpao, gift, live, points/bonus, account, article/activity, training, level, recruitment, and close-balance updates.

## Integration Handoff

The frontend developer can replace `MOCK_PORTAL_NOTIFICATIONS` with an API query and keep the `PortalNotification` type, menu callbacks, route links, and read-state UI unchanged. The current read state is local component state only and has no persistence or backend side effects.

## Verification

- TypeScript/lint check the Web Portal project.
- Confirm the Navbar badge shows unread count.
- Confirm all mock items are visible via scrolling.
- Confirm opening an item marks it read and navigates to its route.
- Confirm the full notifications page uses the same items and supports the same read interactions.
