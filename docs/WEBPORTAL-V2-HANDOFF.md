# PX VJ Web Portal v2

## Development Hand-off

วันที่จัดทำ: 2026-08-09  
สถานะ: UI/UX และ Mock flow พร้อมส่งต่อ Frontend/Backend Integration

เอกสารนี้สรุปสิ่งที่ออกแบบและพัฒนาใน Web Portal v2 รวมถึงงานที่ต้องทำต่อก่อนเปิดใช้งาน Production

## 1. ขอบเขตระบบ

Web Portal แบ่งการแสดงผลตามสถานะสมาชิกและสถานะการเข้าสู่ระบบ:

| กลุ่มผู้ใช้ | การใช้งานหลัก |
|---|---|
| Guest | หน้า Public, About, Activity, Article, Recruitment Apply, Login |
| VJ User | Home, App/สังกัด, Live, Training, Exam, Level, Wallet, Points, History, Notification, Profile |
| General User | Home, Wallet, Points, Angpao, Gift, PX Market, Voice Room, History, Profile โดยไม่มีข้อมูล App |

หลักการสำคัญ:

- ข้อมูลที่เกี่ยวข้องกับ App ต้องแยกตาม App เสมอ
- General User ต้องไม่เห็นเมนูหรือข้อมูลเฉพาะ VJ
- App ที่ Admin ปิดใช้งานต้องไม่แสดงในฝั่ง User
- Mock UI ใช้เพื่อแสดงทุก State จนกว่า API จริงจะพร้อม
- ข้อมูลส่วนตัวและธุรกรรมต้องดึงเฉพาะของ User ที่ Login อยู่เท่านั้น

## 2. สิ่งที่ทำแล้ว

### 2.1 Navigation และ Layout

- Login สำเร็จแล้วส่งไป `/home`
- Guest และ Authenticated User ใช้ Home คนละ State
- Mobile ใช้ Bottom Navigation ตามแนวทาง Mobile-first
- Desktop ใช้ Navigation/Header สำหรับเมนูหลัก
- Mini App แยก Function ที่ต้อง Login เช่น ตลาด PX, ห้องเสียง, Live, อังเปา, ของขวัญ, คะแนน และห้องเรียน
- Notification อยู่บน Navbar และมีหน้า `/member/notifications`
- เพิ่มปุ่มย้อนกลับรูปแบบเดียวกันสำหรับหน้าภายในระบบ
- หน้าเกี่ยวกับเราและเมนูย่อยใช้ Dropdown แบบ Hover/Keyboard-friendly ตาม MUI pattern

ไฟล์หลัก:

- `src/app/*/page.tsx`
- `src/components/Header/`
- `src/components/MobileBottomNavigation/`
- `src/components/BackToPreviousButton/`
- `src/content/MiniApp/`

### 2.2 Public Website

- Public Home ใช้เป็นหน้าแนะนำระบบและ CTA สมัครเป็น VJ
- ตัด App chooser ออกจากหน้า Guest
- แสดง Top VJ STAR LIVE และมี Auto-scroll rail
- แสดง Activity/STAR LIVE ล่าสุด พร้อม Preview และลิงก์ไป Activity
- แสดง Review/Content ในรูปแบบ Card
- ดึง App icon และรูปภาพจากระบบเมื่อมีข้อมูล
- ย้ายช่องทาง Download Application ไปไว้ Footer
- หน้า Article Detail ใช้ Light Theme, มี Cover Image, Metadata, Related Content และปุ่มกลับ
- หน้า Register มี Success Page หลังสมัครเสร็จ

Routes ที่เกี่ยวข้อง:

- `/`
- `/public`
- `/about`
- `/activity`
- `/article`
- `/article/detail/[id]`
- `/register`
- `/register/success`
- `/login`

### 2.3 Recruitment Apply

UI Form รองรับข้อมูลหลักของผู้สมัคร เช่น:

- Profile picture แบบตัวเลือก
- ชื่อจริงและนามสกุล
- ชื่อเล่น
- เพศ
- เบอร์โทรศัพท์พร้อมประเทศ/รหัสประเทศ
- Email
- วันเดือนปีเกิด
- ประวัติการเป็น VJ
- ความสามารถพิเศษ
- Social link
- PX ID ผู้แนะนำ
- Line ID
- ที่อยู่ โดยเลือกประเทศก่อน แล้วจึงเลือกจังหวัด/เขต/อำเภอ/รหัสไปรษณีย์
- เหตุผลหรือข้อมูลเพิ่มเติมตามเงื่อนไข Form
- Source/Referral จาก URL ที่ผู้สมัครเข้ามา ไม่ให้ผู้สมัครเลือก Source เอง

งานที่มีใน UI:

- Required validation สำหรับข้อมูลที่จำเป็น
- Duplicate warning state
- Apply Success state
- รองรับ Source Link/Referral Link เป็นข้อมูลจาก URL

### 2.4 Home หลัง Login

ส่วนที่มีใน Home:

- Profile Strip พร้อมชื่อ, PX ID และสถานะ KYC
- KYC ที่กดไปหน้า `/profile?tab=kyc` ได้
- การ์ด `จำนวนโบนัสที่ใช้ได้` ประกอบด้วย:
  - ยอดเงิน พร้อมปุ่มถอนหรือไป KYC
  - ยอด PX Coin พร้อมปุ่มแลก
  - คะแนนที่ใช้ได้ พร้อมปุ่มไปตลาด PX
- ใช้ `data.total_balance` จาก `/live-points/me` สำหรับคะแนนรวมที่ใช้ได้ทุก App
- Section `ภารกิจของคุณ` อยู่ก่อน `ทางลัดการใช้งาน`
- ภารกิจรายวันเปิด Dialog สถานะกำลังพัฒนา
- ภารกิจ VJ Star Live แสดง Progress แยกตาม App
- Top VJ STAR LIVE แสดงรูปแบบ Card และ Auto-scroll
- Quick Actions รองรับการเข้าโดยตรงเมื่อมี App เดียว และไปหน้าเลือก App เมื่อมีหลาย App
- ปุ่มขึ้น Live เปิด StartLive โดยตรงเสมอ และเลือก App อัตโนมัติเมื่อมี App เดียว
- General User จะเห็นเฉพาะ Function ที่ใช้ร่วมกัน ไม่เห็น Live/Training/Level/App-specific

ไฟล์หลัก:

- `src/content/Home/index.tsx`
- `src/content/Home/homeData.ts`
- `src/content/Home/homeInteractions.ts`
- `src/content/Home/shortcutRouting.ts`
- `src/lib/features/px_market_product/index.ts`

### 2.5 App/สังกัด และ Level

- `/member/profile` แสดง Card ของ App ที่ User มีอยู่
- Card แสดง App icon, ชื่อ App, User ID, Room ID, โบนัส/รายได้, Tag และ Level ตาม App
- มีปุ่มดูข้อมูลและ Function ที่เกี่ยวข้องกับ App
- App ที่ถูกปิดใช้งานจะถูกกรองออกจาก `getMemberApplications`
- มีหน้า Level Progress แยกตาม App ที่ `/member/level-progress/[appId]`
- ภารกิจและ Progress ถูกออกแบบให้รองรับ Level 1-4 และคะแนนต่อ Level
- รายละเอียด App เชื่อมไป Bonus/สังกัด, Training, Level Progress และ StartLive

### 2.6 Training และ Exam

หน้าที่มี:

- `/member/training` เลือก App ก่อนเข้าเรียน
- `/profile/vj_star_video/[id]` สำหรับบทเรียน/วิดีโอ
- `/member/training/[appId]/exams` รายการข้อสอบทั้งหมดของ App
- `/member/training/[appId]/exam/[lessonId]` หน้าทำข้อสอบ

UI ที่ทำแล้ว:

- Card App แสดงจำนวนบทเรียนทั้งหมด, เรียนเสร็จ, สอบผ่าน, สอบไม่ผ่าน และเหลือต้องเรียน
- Mock Exam State: ผ่านแล้ว, ไม่ผ่านและสอบใหม่ได้, พร้อมสอบ และยังไม่เปิดสอบ
- รองรับคำถาม 3 ประเภท: เลือก 1 ข้อ, เลือกหลายข้อ และถูก/ผิด
- ปุ่มส่งข้อสอบเปิด Confirmation Dialog ก่อนส่ง
- Dialog มี Zoom Transition, Pulse Animation, Gradient Header และแสดงจำนวนข้อ/สิทธิ์สอบ
- สอบเสร็จแสดงคะแนนและคำตอบของแต่ละข้อว่า ถูก/ผิด พร้อมเฉลย
- กรณีสอบไม่ผ่านมีปุ่ม `สอบใหม่` และ `ดูข้อสอบทั้งหมด`
- กรณีสอบผ่านมีปุ่ม `ดูข้อสอบทั้งหมด`
- ปุ่มกลับหน้าบนหน้าสอบจะไปหน้ารวมข้อสอบโดยตรง ไม่ใช้ Browser Back ที่อาจย้อนเข้าหน้าสอบเดิม

ไฟล์หลัก:

- `src/content/TrainingAppSelection/index.tsx`
- `src/content/TrainingExamOverview/index.tsx`
- `src/content/TrainingExam/index.tsx`
- `src/content/TrainingExam/examReview.ts`

### 2.7 Profile, KYC และบัญชีธนาคาร

`/profile` ถูกปรับเป็นหน้าตั้งค่าข้อมูลส่วนตัวแบบ Section/Tab:

- ข้อมูลส่วนตัว
- ข้อมูลบัญชีธนาคาร
- ข้อมูล KYC

เงื่อนไขที่ออกแบบไว้:

- Profile picture แก้ไขได้
- เพศและประเทศเป็น Dropdown
- จังหวัด/เขต/อำเภอ/รหัสไปรษณีย์สัมพันธ์กับประเทศ
- เบอร์โทรแสดงประเทศและรหัสประเทศ
- ข้อมูลติดต่อ เช่น Email, เบอร์โทร และ Line ID ไม่ให้ User แก้ไขเอง เพราะเชื่อมกับ Login/Notification
- มีปุ่มยกเลิกใน Form ที่แก้ไขได้
- KYC ที่ผ่านแล้ว Lock ไม่ให้แก้ไขหรือส่งข้อมูลใหม่
- KYC ที่ไม่ผ่านแสดงเหตุผลและเปิดให้ส่งข้อมูลใหม่
- สถานะ KYC ใน Home และหน้าถอนเงินเชื่อมไปหน้า KYC
- บัญชีธนาคารมีปุ่มยกเลิก

### 2.8 Wallet, Points, Rewards และ History

- `/member/history` รวมธุรกรรมของ User คนปัจจุบันไว้หน้าเดียว
- VJ User แสดง App แยกกัน ไม่รวมเป็น “ทุก App”
- General User แสดงธุรกรรมจากกระเป๋า PX โดยไม่ระบุ App
- รองรับ Filter App, ประเภท, รูปแบบ และสถานะ
- คะแนนแยกจาก PX Coin
- `/profile/points_history` แสดงคะแนนคงเหลือ, รับสะสม, ใช้ไป และรายการเคลื่อนไหว
- `/member/angpao` แสดงอังเปา
- `/gift_box` แสดงของขวัญและการรับของขวัญ
- `/px_market` รองรับการใช้ PX Coin หรือคะแนนตามสิทธิ์
- Withdrawal ตรวจสอบ KYC ก่อนทำรายการ

ไฟล์หลัก:

- `src/content/MemberHistory/`
- `src/content/PointsHistory/`
- `src/content/GiftBox/`
- `src/content/withdrawMoney/`
- `src/content/withdrawFrom/`
- `src/content/PXMarket/`

### 2.9 Notification และ Mock State

- Mock Notification แยกเป็นรายการละ Event ไม่รวมหลายเหตุการณ์เข้าด้วยกัน
- ครอบคลุม KYC, ถอนเงิน, ตลาด PX, อังเปา, ของขวัญ, Live, คะแนน, Training, Level และระบบ
- แต่ละรายการมี Title, Description, Category, เวลา, สี, Icon, Read/Unread และ Deep Link
- Mock Member Gallery แสดง State ของ VJ และ General User เพื่อใช้ตรวจ UI โดยไม่ต้องรอ API

ไฟล์หลัก:

- `src/mocks/notifications.ts`
- `src/mocks/memberStateGallery.ts`
- `src/content/MemberStateGallery/`
- `/dev/ui-states`

## 3. สถานะข้อมูลปัจจุบัน

| ส่วน | สถานะปัจจุบัน | งานที่ต้องระวัง |
|---|---|---|
| Login/Session | ต่อกับ NextAuth/Firebase flow | ตรวจ Token, Session expiry และ redirect |
| Profile/Member | มี Query เดิมใช้งาน | ตรวจ field จริงของ VJ/General และ null handling |
| KYC | มีข้อมูลและ UI State | ตรวจ status/rejection reason/lock rule |
| Wallet/PX Coin | มี Query เดิมใช้งาน | ตรวจยอดรวมและการ invalidate หลังทำรายการ |
| Live Points | ใช้ `/live-points/me` และ transactions | ยืนยันว่า `total_balance` รวมทุก App จริง |
| Top VJ | มี API พร้อม fallback | ตรวจรูปภาพและ pagination |
| Notification | Mock UI | รอ Notification API จริง |
| Training/Exam | Mock data และ UI flow | รอ Course/Lesson/Question API จริง |
| Exam result | คำนวณใน Frontend เพื่อ Demo | ต้องย้ายการตรวจคำตอบและบันทึกผลไป Backend |
| Transaction History | มีการรวมและ Filter ฝั่ง Frontend | ต้องกำหนด API contract และ pagination |
| Register/Apply | มี Form/UI | ต้องยืนยัน payload, duplicate rule และ Source capture |

## 4. งาน Frontend ที่ต้องทำต่อ

### Priority 1: API Integration

- เปลี่ยน Mock Notification เป็น API จริง พร้อม read/unread และ deep link
- เปลี่ยน Training App/บทเรียน/ข้อสอบจาก Mock เป็น API จริง
- เปลี่ยน Exam result จากการคำนวณใน Browser เป็นผลจาก Backend
- Map field ของ App, Level, Training, Live, Wallet และ KYC กับ response จริง
- เพิ่ม Loading, Empty, Error และ Retry State ให้ทุก Query หลัก
- ตรวจให้ App ที่ `is_active = false` ไม่แสดงทั้ง Home, Profile, Training, Level และ Shortcut

### Priority 2: Training/Exam

- แสดงบทเรียนและหัวข้อจริงตามลำดับ
- Lock หัวข้อถัดไปจนกว่าหัวข้อก่อนหน้าจะเสร็จ
- Lock ข้อสอบจนกว่าทุกหัวข้อในบทเรียนจะเสร็จ
- แสดงจำนวนข้อสอบตามค่า Admin
- รองรับ Random Question จากคลังโดยไม่ซ้ำกันใน Attempt เดียว
- แสดง Attempt remaining จาก Backend
- แสดงเฉลย/คำตอบถูกผิดตามสิทธิ์ที่ Admin กำหนด
- ป้องกันการกด Submit ซ้ำระหว่าง Request
- รองรับ Refresh/เปิดหน้าเดิมระหว่างทำข้อสอบโดยไม่ทำ State หายตาม Policy ที่ Backend กำหนด

### Priority 3: Member Type และ Routing

- ตรวจ Guard ของ VJ-only route เช่น Training, Level และ Live
- ตรวจ General User ว่าไม่เห็น App, Level, Training และข้อมูลธุรกรรมที่มี App
- ตรวจ VJ User ที่มี 1 App และหลาย App ให้เข้า Shortcut ถูกเส้นทาง
- ตรวจ StartLive ให้เลือก App อัตโนมัติเมื่อมี App เดียว
- ใช้ App ID ที่ผ่านการ Encode/Encrypt ตามมาตรฐานเดียวกันทุก Route

### Priority 4: UX/Quality

- ปรับข้อความ Loading/Empty/Error ให้เป็นภาษาไทยและใช้ Style เดียวกัน
- เพิ่ม Keyboard focus, aria-label และ Dialog focus trap
- ตรวจ Mobile layout ที่ 320px, 375px, 768px และ Desktop
- ตรวจการแสดงตัวเลขจำนวนมาก, วันที่, เวลา และ Timezone
- ตรวจรูปภาพ App/Profile ที่ไม่มีค่าให้แสดง Fallback ที่เหมาะสม
- แยก Component ที่ยังมี JSX บรรทัดยาวมาก เพื่อดูแลต่อได้ง่าย

## 5. งาน Backend ที่ต้องทำต่อ

### 5.1 Authentication และ Member

- ยืนยัน Session/JWT contract สำหรับ Web Portal v2
- คืน `member_type` ที่ชัดเจน: `vj_member` หรือ `general_member`
- คืน Profile และ Member detail ของ User ที่ Login อยู่เท่านั้น
- กำหนดสิทธิ์ Admin-only สำหรับการแก้ Email, เบอร์โทร และ Line ID
- กำหนด App activation state และไม่ส่ง App ที่ปิดใช้งานให้ User หรือให้ Frontend filter ได้อย่างถูกต้อง

### 5.2 Home Summary

- Endpoint สำหรับ KYC summary และสถานะที่ใช้ใน Home
- Endpoint สำหรับ Wallet balance และ PX Coin
- `/live-points/me` ต้องระบุให้ชัดว่า `total_balance` เป็นยอดรวมทุก App และ `by_org` เป็นยอดแยก App
- Endpoint สำหรับ App progress, Level, Mission และ Training summary
- Endpoint สำหรับ Top VJ STAR LIVE พร้อมรูป Profile และ App ที่เกี่ยวข้อง

### 5.3 Recruitment/Apply

- รับ Form สมัครจาก Web Portal ตาม Required/Optional field ใหม่
- เก็บ `source`, `referral_link`, `campaign`, `line_id`, `whatsapp_phone` และ UTM ที่เกี่ยวข้อง
- Source ต้องมาจาก URL/Referral context ไม่ให้ Client เชื่อถือค่าที่ผู้ใช้แก้เอง
- ตรวจ Duplicate จาก Email, เบอร์โทร และเงื่อนไขผู้สมัครเดิม
- ส่ง Apply Success status และ Application status ที่ตรวจสอบได้
- กำหนด rate limit, validation และ audit log สำหรับการสมัคร

### 5.4 Notification

- สร้าง API รายการ Notification ของ User ปัจจุบัน
- แยก Event เป็นรายการละหนึ่งเหตุการณ์
- รองรับ `id`, `type`, `title`, `description`, `created_at`, `is_read`, `target_url` และ metadata
- เพิ่ม Read one/Read all และ unread count
- กำหนด Event จาก KYC, ถอนเงิน, อังเปา, ของขวัญ, คะแนน, Live, Training, Level และระบบ
- ป้องกัน Notification ซ้ำด้วย event idempotency key

### 5.5 Training และ Exam

- API หลักสูตร/บทเรียน/หัวข้อ/Video/PDF ตาม App
- API lesson progress และ topic completion
- API exam set ต่อบทเรียน
- API random question ตามจำนวนที่ Admin ตั้งค่า โดยไม่ซ้ำใน Attempt เดียว
- API submit exam ที่ตรวจคำตอบบน Server
- บันทึก Attempt, Score, Pass/Fail, Answer review และ Attempt remaining
- กำหนดสิทธิ์การเห็นเฉลยหลังสอบ
- ป้องกัน Submit ซ้ำ, Replay request และแก้ผลสอบจาก Client
- ส่งสถานะ `locked`, `ready`, `retryable`, `passed`, `exhausted` ให้ Frontend

### 5.6 Wallet, Points และ History

- ยืนยันยอดคะแนนใช้ได้รวมทุก App และยอดแยก App
- แยกคะแนน, PX Coin, เงิน และโบนัสให้ชัดเจนใน API
- API Redeem คะแนนต้องตรวจ balance, App/organization และราคา ณ เวลาทำรายการ
- API ธุรกรรมรวมของ User ปัจจุบัน พร้อม Filter, Pagination และ Sort
- VJ Transaction ต้องมี `organization_id`/App
- General User Transaction ต้องอนุญาต `organization_id = null` และไม่แสดง App ปลอม
- คืนประเภท, รูปแบบ, รายการ, สถานะ, ยอด, หมายเหตุ และวันที่แบบมาตรฐานเดียวกัน

### 5.7 KYC และ Withdrawal

- คืน KYC record ล่าสุดและเหตุผลการปฏิเสธ
- Lock การแก้ไขเมื่อ approved
- เปิดส่งใหม่เมื่อ rejected ตาม Policy
- ตรวจ KYC ก่อนถอนเงินที่ Backend ทุกครั้ง ห้ามพึ่ง Frontend อย่างเดียว
- บันทึก Audit log ของ KYC และ Withdrawal decision

## 6. API Contract ที่ต้องยืนยันร่วมกัน

| หัวข้อ | ข้อตกลงที่ต้องยืนยัน |
|---|---|
| Member type | ค่า enum ที่ใช้จริงและ fallback เมื่อไม่มีค่า |
| App activation | `is_active`, `vj_active` และความหมายของแต่ละ field |
| Points | `total_balance`, `total_earned`, `total_spent`, `by_org` |
| KYC | `pending`, `approved`, `rejected`, `expired`, `not_started` |
| Exam status | `locked`, `ready`, `retryable`, `passed`, `exhausted` |
| Transaction type | รายรับ/รายจ่าย และประเภทคะแนน/Coin/เงิน |
| IDs | member ID, PX ID, User ID, Room ID, organization ID ใช้ field ไหน |
| Date/time | ISO 8601, Timezone และการแสดงผลภาษาไทย |
| Upload | Profile/KYC/Video/PDF URL และ fallback image |
| Error | HTTP status, error code และข้อความที่แสดงแก่ User |

## 7. QA Test Matrix ก่อน Production

### Authentication และ Permission

- Login สำเร็จแล้วไป `/home`
- Logout แล้วไม่สามารถเปิด Auth route เดิมได้
- Session หมดอายุแล้ว redirect ไป Login และไม่วนลูป
- VJ User เห็นเฉพาะเมนู VJ
- General User ไม่เห็น App, Training, Level และ Live
- Admin-only profile fields แก้ไขไม่ได้จาก User client

### Public และ Recruitment

- เปิด Public Home โดยไม่ Login ได้
- CTA สมัครเป็น VJ ทำงานบน Desktop/Mobile
- Register required validation ครบทุก field
- เบอร์โทรเลือกประเทศและรหัสประเทศได้
- Address เปลี่ยนตามประเทศ/จังหวัด/เขต/อำเภอ
- Source มาจาก Referral/URL และผู้สมัครแก้ Source เองไม่ได้
- Duplicate warning แสดงถูกต้อง
- Submit สำเร็จไป Success Page และไม่ยิงซ้ำเมื่อกดหลายครั้ง
- Refresh Success Page แล้วไม่สร้างใบสมัครซ้ำ

### Home หลัง Login

- Profile Strip แสดงชื่อ/PX ID/KYC ถูก User
- KYC ทุกสถานะพาไปหน้า KYC ได้
- Wallet และ PX Coin เป็นของ User คนปัจจุบัน
- คะแนนที่ใช้ได้แสดงจาก `total_balance` และตรวจเทียบกับ `/live-points/me`
- ยอดคะแนนกดไป `/px_market` ได้
- Section ภารกิจอยู่ก่อนทางลัด
- มี 1 App แล้ว Training/โบนัสเข้า App โดยตรง
- มีหลาย App แล้วไปหน้าเลือก App
- ปุ่มขึ้น Live เปิด StartLive และเลือก App ถูกต้อง
- Top VJ rail เลื่อนอัตโนมัติและหยุด/ไม่ทำให้ Layout กระโดด
- General User ไม่เห็น VJ-only section

### App, Level และ Training

- App ที่ Admin ปิดใช้งานไม่แสดงในทุกจุด
- App card แสดง icon จริงหรือ Fallback อย่างถูกต้อง
- Level Progress แยกตาม App
- Training App selection แสดงสรุปบทเรียนถูกต้อง
- บทเรียน/หัวข้อที่ยัง Lock กดเข้าไม่ได้
- หัวข้อที่เสร็จแล้วเปลี่ยนสถานะถูกต้อง
- ข้อสอบเปิดได้เมื่อครบเงื่อนไขบทเรียน
- หน้า Exam รองรับคำถาม 1 คำตอบ, หลายคำตอบ และถูก/ผิด
- Submit ไม่ได้เมื่อยังตอบไม่ครบ
- Confirmation Dialog มี Animation และปิด/ยกเลิกได้
- Submit สำเร็จหนึ่งครั้งไม่สร้าง Attempt ซ้ำ
- ผลสอบผ่านแสดงคะแนนและปุ่มไปข้อสอบทั้งหมด
- ผลสอบไม่ผ่านแสดงข้อถูก/ผิด, เฉลยตามสิทธิ์ และ Attempt ที่เหลือ
- ผลสอบไม่ผ่านมีปุ่มสอบใหม่เมื่อยังมีโควตา
- หมดโควตาแล้วปุ่มสอบใหม่ถูกปิด/หาย
- ปุ่มกลับจากหน้าสอบไปหน้าข้อสอบทั้งหมด ไม่กลับเข้าหน้าสอบเดิม

### Wallet, Reward และ History

- General User เห็นธุรกรรมจากกระเป๋า PX โดยไม่ระบุ App
- VJ User เห็นธุรกรรมแยก App
- Filter App/ประเภท/รูปแบบ/สถานะทำงานร่วมกัน
- Clear filter คืนรายการทั้งหมด
- คะแนนและ PX Coin ไม่ถูกนำมารวมเป็นสกุลเงินเดียว
- แลกของด้วยคะแนนตรวจ balance และ error state
- อังเปา/ของขวัญแสดงรายการแยกกัน
- KYC ไม่ผ่านแล้วถอนเงินไม่ได้
- Withdrawal success/rejected/pending แสดงสถานะและ Notification ถูกต้อง

### Notification

- Unread count ถูกต้อง
- รายการแยกเป็น Event ละหนึ่งรายการ
- กดรายการแล้วไป Target route ถูกต้อง
- Read one/Read all ทำงาน
- Notification ไม่มีข้อมูลหรือ API error ต้องมี Empty/Error state
- Notification บน Mobile ไม่บัง Bottom Navigation

### Responsive และ Accessibility

- ทดสอบ 320px, 375px, 390px, 768px, 1024px และ 1440px
- ไม่มี Text overflow หรือ Card/Modal ล้นหน้าจอ
- ตาราง/รายการที่กว้างสามารถ Scroll ได้โดยไม่ทำให้หน้าแตก
- Dialog ใช้งานด้วย Keyboard และมี Focus trap
- Icon button มี aria-label/tooltip ที่เหมาะสม
- สี Status มี contrast เพียงพอและไม่ได้ใช้สีอย่างเดียวในการสื่อความหมาย
- Loading state ไม่ทำให้ Layout กระโดด

## 8. Performance และ Security Check

- ตรวจ API request ซ้ำด้วย React DevTools/Network tab
- ตรวจ cache invalidation หลัง KYC, Wallet, Points, Gift และ Exam Submit
- ใช้ Pagination กับ History, Notification และรายการข้อสอบที่มีจำนวนมาก
- ไม่ใส่ Secret หรือ Firebase private key ใน Client bundle
- Validate และ authorize ทุก Action ที่ Backend
- ตรวจ XSS จาก Article, Notification และข้อความผู้ใช้
- ตรวจ Upload file type/size/content ก่อนจัดเก็บ
- ตรวจ Rate limit ของ Login, Register, Exam Submit และ Withdrawal
- ตรวจ idempotency ของ Redeem, Withdrawal, Exam Submit และ Accept Gift

## 9. คำสั่งตรวจสอบก่อนส่ง Production

ใช้ Node.js ที่รองรับ Next.js 16 โดยแนะนำ Node.js `>=20.9.0`

```bash
npm ci
npm run lint
npx tsc --noEmit --pretty false

node --experimental-strip-types scripts/verify-latest-feedback.mjs
node --experimental-strip-types scripts/verify-member-state-gallery.mjs
node --experimental-strip-types scripts/verify-member-history-logic.mjs
node --experimental-strip-types scripts/verify-member-type-navigation.mjs
node scripts/verify-member-experience-contract.cjs
node scripts/verify-voice-room-chat-layout.cjs

npm run build
npm run start
```

หลัง `npm run start` ให้ตรวจ Smoke Test อย่างน้อย:

- `/`
- `/login`
- `/home`
- `/member/profile`
- `/member/training`
- `/member/history`
- `/profile`
- `/px_market`
- `/voice-room`
- `/member/notifications`

## 10. Definition of Done สำหรับ Integration

- Frontend ใช้ API จริงแทน Mock ใน Flow ที่ Backend รับรองแล้ว
- Backend มี API contract, authorization, validation และ audit log ครบ
- VJ/General User แสดงข้อมูลไม่ปะปนกัน
- App inactive ไม่แสดงและไม่สามารถเรียก Action ได้
- Training/Exam ใช้ผลจาก Backend และป้องกันการโกง/Submit ซ้ำ
- คะแนนรวมและยอดแยก App ตรงกับ Backend
- History ของ User ปัจจุบันถูกต้องและ Filter ได้
- Notification มี unread/read และ Deep Link ครบ
- QA Matrix ผ่านทั้ง Desktop/Mobile และทุก Critical State
- Production environment ใช้ Env/Secret ที่ถูกต้อง
- มี Rollback plan และ Monitoring หลัง Deploy

## 11. จุดที่ต้องยืนยันกับ SA/PM ก่อนเชื่อมจริง

- คะแนน `total_balance` รวมทุก App หรือรวมเฉพาะ App ที่ Active
- คะแนนจาก Level, Admin แจก และ Live ใช้ยอดเดียวกันหรือมี Wallet แยก
- เมื่อ App ถูกปิดใช้งาน ประวัติเดิมยังแสดงหรือซ่อนทั้งหมด
- สิทธิ์การเห็นเฉลยข้อสอบหลังสอบ
- การนับ Attempt เมื่อผู้ใช้ปิดหน้า/Network timeout
- Source/Referral ที่ใช้เป็น Attribution หลักเมื่อมีหลาย Campaign
- Notification retention และการ Mark as read
- Timezone ที่ใช้คำนวณรอบ Live, Level และโบนัส
- กฎการถอนเงิน/แลกของสำหรับ General User และ VJ User

