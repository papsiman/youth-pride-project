/**
 * Load Test Script (Built-in Fetch)
 * จำลองการส่ง Request พร้อมกันจำนวนมากเพื่อทดสอบ PgBouncer + Prisma
 */

// เปลี่ยนเป็น URL สาธารณะของคุณเพื่อทดสอบ Load ผ่าน Internet จริงๆ
const TARGET_URL = 'https://djnn04v2-3000.asse.devtunnels.ms/api/user/status';
const CONCURRENT_USERS = 500;  // จำนวนคนเข้าพร้อมกันใน 1 รอบ
const TOTAL_REQUESTS = 5000;    // จำนวน Request ทั้งหมดที่จะทดสอบ

async function runTest() {
  console.log('--- Starting Load Test ---');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  const sendRequest = async () => {
    try {
      const lineUserId = `USER_TEST_${Math.floor(Math.random() * 1000000)}`;
      const response = await fetch(`${TARGET_URL}?lineUserId=${lineUserId}`);

      if (response.ok) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (e) {
      errorCount++;
    }
  };

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_USERS) {
    const batch = Array.from({ length: Math.min(CONCURRENT_USERS, TOTAL_REQUESTS - i) }, () =>
      sendRequest()
    );
    await Promise.all(batch);
    process.stdout.write('█');
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  const tps = (TOTAL_REQUESTS / duration).toFixed(2);

  console.log('\n\n--- Test Results ---');
  console.log(`Duration: ${duration.toFixed(2)} seconds`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Throughput: ${tps} requests/sec`);

  if (errorCount === 0) {
    console.log('\n✅ ระบบทำงานได้เสถียรภายใต้โหลดนี้!');
  } else {
    console.log('\n⚠️ พบข้อผิดพลาด! อาจเกิดจาก Database Connection เต็ม หรือ Server ตอบสนองไม่ทัน');
  }
}

runTest();
