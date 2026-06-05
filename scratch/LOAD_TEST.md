# 🚀 Performance & Load Testing Guide

คู่มือการทดสอบประสิทธิภาพของระบบ Youth Pride Project โดยใช้สคริปต์จำลองการเข้าใช้งานพร้อมกัน

## 📋 เตรียมความพร้อม
ก่อนเริ่มทดสอบ ตรวจสอบให้แน่ใจว่า:
1.  รัน Docker Services อยู่ (`docker-compose up -d`)
2.  รัน Development Server อยู่ (`npm run dev`)
3.  ไฟล์ `.env` เชื่อมต่อผ่าน PgBouncer พอร์ต `6432`

## 🛠 วิธีการรัน Load Test
เปิด Terminal ใหม่แล้วรันคำสั่ง:
```bash
node scratch/load-test.mjs
```

## ⚙️ การปรับแต่งค่าการทดสอบ
คุณสามารถแก้ไขไฟล์ `scratch/load-test.mjs` เพื่อปรับระดับความโหดของการทดสอบได้ที่บรรทัดด้านบน:

```javascript
const CONCURRENT_USERS = 50;  // จำนวนคนเข้าพร้อมกันในแต่ละรอบ (Batch)
const TOTAL_REQUESTS = 200;    // จำนวนคำขอทั้งหมดที่จะทดสอบ
```

*   **ระดับเริ่มต้น**: 50 Concurrent / 200 Total (แนะนำสำหรับเครื่องทั่วไป)
*   **ระดับปานกลาง**: 100 Concurrent / 1,000 Total
*   **ระดับสูง**: 500 Concurrent / 5,000 Total (ต้องใช้เครื่องที่แรงพอสมควร)

## 📊 วิธีอ่านผลการทดสอบ
*   **Duration**: เวลาทั้งหมดที่ใช้
*   **Success**: จำนวนคำขอที่บันทึกข้อมูลสำเร็จ (HTTP 200)
*   **Errors**: จำนวนคำขอที่ล้มเหลว (หากมีแสดงว่าฐานข้อมูลเริ่มรับไม่ไหว หรือ Connection เต็ม)
*   **Throughput (TPS)**: ความเร็วเฉลี่ย (Requests per Second) ยิ่งสูงยิ่งดี

## 🚨 ข้อควรระวัง
*   **CPU Usage**: การรัน Load Test บนเครื่องเดียวกับที่รัน Server จะทำให้ CPU แย่งทรัพยากรกันเอง ตัวเลขที่ได้อาจจะต่ำกว่าความเป็นจริงเล็กน้อย
*   **Database Cleanup**: หลังจบการทดสอบ หากต้องการลบข้อมูลทดสอบทิ้ง ให้รัน SQL Script ที่ผมให้ไว้ก่อนหน้าเพื่อ Clear ตาราง `User` และ `UserProgress` ครับ

---
🏳️‍🌈 **Youth Pride Project 2026** - High Performance Architecture
