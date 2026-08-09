# PX VJ Web Portal v2

โปรเจกต์ Web Portal รุ่นใหม่สำหรับพัฒนาแยกจากระบบเดิม โดยใช้โปรเจกต์เดิมเป็น Reference:

- Reference: `frontend/pg-group-frontend-webportal-main`
- New project: `frontend/pg-group-frontend-webportal-v2`

## เป้าหมาย

แยกประสบการณ์ผู้ใช้ออกเป็น 2 โหมด:

- **Guest / Public**: นำเสนอข้อมูลทั่วไปและกระตุ้นให้สมัครเป็น VJ
- **VJ Application**: หลัง Login แสดง Function หลักของ VJ ในรูปแบบคล้าย Mobile App

โปรเจกต์นี้ยังคงใช้ API, Theme, Component และระบบ Authentication เดิมเป็นฐานในระยะแรก การย้ายหรือปรับ Module ให้ทำทีละส่วนและตรวจสอบกับระบบเดิมทุกครั้ง

## โครงสร้างการทำงาน

```text
src/
  app/              # Route เดิมและ route ใหม่ของ Web Portal
  components/       # Component กลางที่ใช้ร่วมกัน
  content/          # เนื้อหาและหน้าเดิมของระบบ
  features/
    public/         # Module สำหรับผู้ที่ยังไม่ Login
    vj/             # Module สำหรับ VJ หลัง Login
  lib/              # API, Redux และ service เดิม
  mock/             # Mock data/service สำหรับ Module ที่ยังไม่มี API
  docs/             # เอกสารโครงสร้างและแผนย้าย Module
```

## คำสั่งเริ่มต้น

```bash
npm install
npm run dev -- --port 3001
```

เปิด [http://localhost:3001](http://localhost:3001)

ใช้พอร์ต `3001` เพื่อไม่ชนกับ Web Portal เดิมที่อาจกำลังรันอยู่บน `3000`

## ขอบเขตการย้าย Module

1. Public Home และข้อมูลทั่วไป
2. Register / Recruitment Apply
3. Login และการตรวจสอบ Session
4. VJ Application Shell และ Mobile Bottom Navigation
5. Home Status Summary
6. Training, Level, Wallet และ Notifications
7. Profile, App Switcher และข้อมูลข่าวสารบริษัท

รายละเอียดดูที่ `docs/WEBPORTAL-V2-STRUCTURE.md`
