# Youth Pride Project Specification

## 4. Key Features & Requirements

### 4.1 ระบบลงทะเบียน (LIFF Registration)
- **Flow**: เมื่อเปิด LIFF ครั้งแรก ระบบต้องตรวจสอบ lineUserId ใน DB
- **Form**: หากยังไม่เคยลงทะเบียน ให้แสดงฟอร์มเก็บข้อมูล (ชื่อจริง, เบอร์โทร)
- **Auto-fill**: ดึง displayName จากโปรไฟล์ LINE มาแสดงเบื้องต้น
- **Action**: บันทึกข้อมูลลง PostgreSQL และ Redirect ไปหน้า Dashboard ของกิจกรรม

### 4.2 ระบบกิจกรรมตอบคำถาม (LIFF Quiz)
- **Structure**: มีทั้งหมด 3 ฐาน แต่ละฐานมี 5 คำถาม (ใช่/ไม่ใช่)
- **UX**: ออกแบบให้เป็น Single Page Application (SPA) โหลดไว กดตอบแล้วลื่นไหล
- **Logic**: ไม่เน้นถูก/ผิด แต่ต้องตอบให้ครบ 5 ข้อจึงจะถือว่าผ่านฐาน
- **Completion**: เมื่อตอบครบ ให้ Update สถานะใน UserProgress และบันทึกเวลาที่สำเร็จ

### 4.3 หน้าแสดงผลความสำเร็จ (Trophy/Dashboard)
- **Feature**: แสดง "ห้องเก็บถ้วยรางวัล" หรือความคืบหน้าของแต่ละฐาน
- **Visual**: ฐานที่ผ่านแล้วจะเปลี่ยนจากไอคอนสีเทาเป็นไอคอนสี/ถ้วยรางวัล (ตามภาพ Flow)

### 4.4 API สำหรับดึงข้อมูล (Internal/External Retrieval)
- **Endpoint**: `GET /api/user/status?lineUserId=...`
- **Purpose**: เพื่อให้ระบบอื่นๆ (เช่น Bot หรือ Admin) มาดึงข้อมูลไปเช็คสถานะการผ่านกิจกรรม
- **Response Example**:
```json
{
  "registered": true,
  "progress": [
    { "checkpointId": 1, "completed": true },
    { "checkpointId": 2, "completed": false },
    { "checkpointId": 3, "completed": false }
  ]
}
```

## 5. Development Constraints
- **Security**: ใช้ `liff.getAccessToken()` เพื่อยืนยันตัวตน User ทุกครั้งที่เรียก API
- **Performance**: เน้นความเร็วในการโหลด (Mobile First) และรองรับ Concurrent User ในช่วงพีคของงาน
- **Database**: จัดการ Connection ผ่าน PgBouncer

---
**Tech Stack:** Next.js, Prisma, PostgreSQL (PgBouncer)
