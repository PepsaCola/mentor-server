import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Groceries', type: 'EXPENSE', color: '#4caf50', keywords: ['walmart', 'kroger', 'grocery', 'supermarket', 'aldi', 'trader joe'] },
  { name: 'Dining Out', type: 'EXPENSE', color: '#ff9800', keywords: ['restaurant', 'starbucks', 'mcdonald', 'coffee', 'cafe', 'doordash', 'ubereats'] },
  { name: 'Transport', type: 'EXPENSE', color: '#2196f3', keywords: ['uber', 'lyft', 'shell', 'chevron', 'gas', 'parking', 'transit'] },
  { name: 'Utilities', type: 'EXPENSE', color: '#607d8b', keywords: ['electric', 'water', 'internet', 'comcast', 'verizon', 'at&t'] },
  { name: 'Entertainment', type: 'EXPENSE', color: '#9c27b0', keywords: ['netflix', 'spotify', 'hulu', 'cinema', 'movie'] },
  { name: 'Health', type: 'EXPENSE', color: '#e91e63', keywords: ['cvs', 'walgreens', 'pharmacy', 'clinic', 'doctor'] },
  { name: 'Rent/Mortgage', type: 'EXPENSE', color: '#795548', keywords: ['rent', 'mortgage'] },
  { name: 'Shopping', type: 'EXPENSE', color: '#3f51b5', keywords: ['amazon', 'target', 'mall', 'store'] },
  { name: 'Transfer', type: 'EXPENSE', color: '#009688', keywords: ['transfer', 'zelle', 'venmo'] },
  { name: 'Other', type: 'EXPENSE', color: '#9e9e9e', keywords: [] },
  { name: 'Salary/Income', type: 'INCOME', color: '#8bc34a', keywords: ['payroll', 'salary', 'direct deposit'] },
  { name: 'Other Income', type: 'INCOME', color: '#cddc39', keywords: [] },
];

async function main() {
  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { userId: null, name: category.name },
    });
    if (!existing) {
      await prisma.category.create({
        data: { ...category, isDefault: true, userId: null },
      });
    }
  }
  console.log(`Seeded ${categories.length} default categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
