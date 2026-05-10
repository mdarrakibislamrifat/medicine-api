import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding started...');
  const filePath = path.join(__dirname, '../final_medicine_data.json');
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ JSON file not found!");
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const medicines = JSON.parse(rawData);

  console.log(`📦 Found ${medicines.length} medicines. Importing...`);

  // ১০০০ করে চাঙ্ক করে ইনসার্ট করা নিরাপদ
  const chunkSize = 1000;
  for (let i = 0; i < medicines.length; i += chunkSize) {
    const chunk = medicines.slice(i, i + chunkSize);
    await prisma.medicine.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`✅ Inserted ${Math.min(i + chunkSize, medicines.length)} medicines...`);
  }

  console.log('🎉 Mission Accomplished!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());