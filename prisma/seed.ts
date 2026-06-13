import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const QUESTIONS_DATA: Record<number, any[]> = {
  1: [
    { text: "ท้องในวัยเรียนสามารถเรียนต่อได้โดยไม่ถูกไล่ออก", type: 'yesno', correctAnswer: 'true' },
    { text: "หากตั้งครรภ์ไม่พร้อม สามารถขอคำปรึกษาจากคลินิกวัยรุ่นของโรงพยาบาลทุกแห่งในเขตสุขภาพที่ 7 หรือโทรสายด่วน 1663", type: 'yesno', correctAnswer: 'true' },
    { text: "การคุมกำเนิดที่เหมาะสมกับวันรุ่น คือ ยาฝังคุมกำเนิด ชนิด 1 หลอดคุมกำเนิดได้ 3 ปี ฝังฟรีทุกสิทธิ์ ทุกโรงพยาบาลอายุ 10 ปีขึ้นไปไม่ต้องขออนุญาตผู้ปกครอง", type: 'yesno', correctAnswer: 'true' },
    { text: "วัยรุ่นสามารถเข้าถึงบริการสุขภาพทางเพศได้โดยไม่ถูกเลือกปฏิบัติและเป็นความลับ", type: 'yesno', correctAnswer: 'true' },
    { text: "หากวัยรุ่นตั้งครรภ์รู้สึกอับอายไม่อยากอยู่บ้านสามารถขอไปอยู่บ้านพักเด็กได้โดยไม่มีค่าใช้จ่าย", type: 'yesno', correctAnswer: 'true' },
  ],
  3: [
    { text: "กรมสุขภาพจิตอยู่ภายใต้กระทรวงสาธารณสุข", type: 'yesno', correctAnswer: 'true' },
    { text: "คนที่ยิ้มเก่งตลอดเวลา จะไม่มีความเครียดเลย", type: 'yesno', correctAnswer: 'false' },
    { text: "การนอนหลับไม่เพียงพอ อาจส่งผลต่อสุขภาพจิตได้", type: 'yesno', correctAnswer: 'true' },
    { text: "กรมสุขภาพจิตมีหน้าที่ดูแลเฉพาะผู้ป่วยในโรงพยาบาลเท่านั้น", type: 'yesno', correctAnswer: 'false' },
    { text: "การออกกำลังกายช่วยลดความเครียดได้", type: 'yesno', correctAnswer: 'true' },
    { text: "หากรู้สึกเครียดมาก ควรเก็บไว้คนเดียวและไม่ต้องบอกใคร", type: 'yesno', correctAnswer: 'false' },
    { text: "เด็กและผู้สูงอายุสามารถมีปัญหาสุขภาพจิตได้ทั้งคู่", type: 'yesno', correctAnswer: 'true' },
    { text: "การบูลลี่กันในโลกออนไลน์ไม่ส่งผลต่อสุขภาพจิต", type: 'yesno', correctAnswer: 'false' },
    { text: "กรมสุขภาพจิตมีการรณรงค์ส่งเสริมสุขภาพจิตในชุมชน", type: 'yesno', correctAnswer: 'true' },
    { text: "การขอคำปรึกษาจากนักจิตวิทยาหรือจิตแพทย์เป็นเรื่องปกติ", type: 'yesno', correctAnswer: 'true' },
  ],
  2: [
    { 
      text: "HIV ทำลายระบบใดของร่างกาย", 
      type: 'choice', 
      options: ["ก. ระบบย่อยอาหาร", "ข. ระบบภูมิคุ้มกัน", "ค. ระบบหายใจ", "ง. ระบบกล้ามเนื้อ"], 
      correctAnswer: '1' 
    },
    { 
      text: "ข้อใดเป็นวิธีป้องกันโรคติดต่อทางเพศสัมพันธ์ที่ดีที่สุด", 
      type: 'choice', 
      options: ["ก. ล้างมือหลังมีเพศสัมพันธ์", "ข. ใช้ถุงยางอนามัยทุกครั้ง", "ค. อาบน้ำทันทีหลังมีเพศสัมพันธ์", "ง. กินวิตามินทุกวัน"], 
      correctAnswer: '1' 
    },
    { 
      text: "ข้อใดไม่ใช่โรคติดต่อทางเพศสัมพันธ์", 
      type: 'choice', 
      options: ["ก. ซิฟิลิส", "ข. หนองใน", "ค. ไข้เลือดออก", "ง. เริม"], 
      correctAnswer: '2' 
    },
    { 
      text: "ถุงยางอนามัยช่วยป้องกันอะไรได้", 
      type: 'choice', 
      options: ["ก. โรคติดต่อทางเพศสัมพันธ์", "ข. การตั้งครรภ์", "ค. HIV", "ง. ถูกทุกข้อ"], 
      correctAnswer: '3' 
    },
    { 
      text: "PrEP คืออะไร", 
      type: 'choice', 
      options: ["ก. ยาป้องกัน HIV ก่อนสัมผัสเชื้อ", "ข. ยารักษาไข้หวัด", "ค. วัคซีนโรคเอดส์", "ง. ยาฆ่าเชื้อแบคทีเรีย"], 
      correctAnswer: '0' 
    },
  ]
};

async function main() {
  const checkpoints = [
    { name: 'ศูนย์อนามัยที่ 7' },
    { name: 'สำนักงานป้องกันควบคุมโรคที่ 7' },
    { name: 'ศูนย์สุขภาพจิตที่ 7' },
  ]

  console.log('Seeding checkpoints...')

  for (const cp of checkpoints) {
    const cpId = checkpoints.indexOf(cp) + 1;
    await prisma.checkpoint.upsert({
      where: { id: cpId },
      update: { name: cp.name },
      create: {
        id: cpId,
        name: cp.name,
      },
    })
    
    // Seed questions if none exist
    const questionCount = await prisma.question.count({ where: { checkpointId: cpId } });
    if (questionCount === 0 && QUESTIONS_DATA[cpId]) {
      console.log(`Seeding questions for checkpoint ${cpId}...`)
      const qs = QUESTIONS_DATA[cpId];
      await prisma.question.createMany({
        data: qs.map((q, idx) => ({
          checkpointId: cpId,
          text: q.text,
          type: q.type,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          order: idx
        }))
      })
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
