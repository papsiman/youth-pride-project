import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const checkpoints = [
    { name: 'ศูนย์อนามัยที่ 7' },
    { name: 'ศูนย์สุขภาพจิตที่ 7' },
    { name: 'สำนักงานป้องกันควบคุมโรคที่ 7' },
  ]

  console.log('Seeding checkpoints...')

  for (const cp of checkpoints) {
    await prisma.checkpoint.upsert({
      where: { id: checkpoints.indexOf(cp) + 1 },
      update: {},
      create: {
        id: checkpoints.indexOf(cp) + 1,
        name: cp.name,
      },
    })
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
