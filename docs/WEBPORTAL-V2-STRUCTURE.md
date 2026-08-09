# Web Portal v2 Structure

## หลักการ

ระบบแบ่งตามสถานะการเข้าสู่ระบบ ไม่ใช่แยกเป็นเว็บไซต์คนละชุด:

```text
Guest
  Public Home
  About / Activity / Article
  Recruitment Apply
  Login

Authenticated VJ
  VJ Home
  Training / Lesson
  Level / Point
  Wallet / Income
  Live / Mission
  Notifications
  Profile / Settings
```

## Route ที่ต้องรักษา

### Public

- `/`
- `/home`
- `/about`
- `/activity`
- `/article`
- `/register`
- `/login`

### VJ Application

- `/member/home`
- `/member/training`
- `/member/level`
- `/member/wallet`
- `/member/live`
- `/member/notifications`
- `/member/profile`
- `/member/settings`

หมายเหตุ: Route เดิมของ Member Area ยังเก็บไว้เป็น Reference และยังไม่ควรลบจนกว่าจะย้าย Module เสร็จ

## Navigation

### Guest

ใช้ Header สำหรับข้อมูลทั่วไป และให้ `สมัครเป็น VJ` เป็น CTA หลัก โดยมี `เข้าสู่ระบบ` เป็น CTA รอง

### VJ Application

บนมือถือใช้เมนูด้านล่าง:

- หน้าหลัก
- งาน / ภารกิจ
- การเรียน
- รายได้
- เพิ่มเติม

บน Desktop ใช้ Sidebar ที่จัดกลุ่มตามการทำงานของ VJ และมี Notification อยู่ใน Header

## Home หลัง Login

หน้าแรกควรเรียงข้อมูลตามสิ่งที่ผู้ใช้ต้องทำก่อน:

1. สถานะบัญชีและ App ที่กำลังใช้งาน
2. งานหรือการแจ้งเตือนที่ต้องดำเนินการ
3. ความคืบหน้าการเรียนและ Level
4. รายได้ล่าสุด
5. สถานะ Live / Mission
6. ข่าวสารบริษัทในลำดับรอง

ไม่ควรใช้ Hero แบบหน้า Public ซ้ำในหน้า VJ Application

## Multi-App

ข้อมูลที่ขึ้นกับ App ต้องแยกตาม App เสมอ:

- App status
- Level และคะแนน
- หลักสูตรและความคืบหน้า
- รายได้
- Mission / STAR LIVE

ควรมี App Switcher หรือ App Card ให้ผู้ใช้เลือก App ก่อนดูข้อมูลเฉพาะ App

## Migration Rules

- ใช้ Component เดิมก่อนสร้าง Component ใหม่
- ไม่ลบ Route เดิมระหว่างย้าย Module
- API ที่ยังไม่พร้อมให้แยก Mock service ไว้ใน `src/mock`
- ทุกหน้าใหม่ต้องมี Loading, Empty และ Error state
- ข้อมูลส่วนตัวต้องผ่าน Session และ permission ก่อนแสดง
- ปรับทีละ Module และตรวจสอบกับโปรเจกต์ Reference ก่อนรวมงาน
