# Mobile Message Icon and Mission Card Themes

## Scope

ปรับ UI ของ Web Portal v2 สองจุดตาม feedback ล่าสุด:

1. เมนู `กล่องข้อความ` ใน Mobile Bottom Navigation ใช้ไอคอนรูปแชต และคงลิงก์ไปหน้าการแจ้งเตือนเดิม
2. การ์ดภารกิจในหน้า Home ของ VJ User แยก theme ตามความหมายของภารกิจ

## Design

- ใช้ `ChatBubbleOutlineRoundedIcon` เฉพาะไอคอนเมนูมือถือ `กล่องข้อความ`
- ไม่เปลี่ยนไอคอน Notification บน Header desktop หรือ logic ของ Notification Menu
- `ภารกิจรายวัน` ใช้พื้นส้มอ่อน ขอบส้ม และไอคอนส้ม
- `ภารกิจ VJ Star Live` ใช้พื้นม่วงอ่อน ขอบม่วง และไอคอนม่วง
- คง interaction เดิม: ภารกิจรายวันเปิด Dialog และภารกิจ VJ Star Live เปิด/ปิดรายละเอียด
- คง responsive layout เดิมและไม่เพิ่ม API หรือเปลี่ยน routing

## Acceptance Criteria

- Mobile Bottom Navigation แสดงไอคอนแชตให้เมนู `กล่องข้อความ`
- เมนูดังกล่าวยังนำไป `/member/notifications`
- Desktop Header ยังใช้ Notification icon เดิม
- การ์ดภารกิจรายวันมองเห็นเป็นธีมส้มอ่อน
- การ์ดภารกิจ VJ Star Live มองเห็นเป็นธีมม่วงอ่อน
- TypeScript และ production build ผ่าน
