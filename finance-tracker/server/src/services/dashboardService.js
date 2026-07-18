import dayjs from 'dayjs';

import prisma from '../lib/prisma.js';

const buildDateFilter = (from, to) => {
  if (!from && !to) return undefined;
  const filter = {};
  if (from) filter.gte = new Date(from);
  if (to) filter.lte = new Date(to);
  return filter;
};

const dayKey = (date) => date.toISOString().slice(0, 10);

export const getDashboardSummary = async (userId, { from, to } = {}) => {
  const dateFilter = buildDateFilter(from, to);
  const where = { userId, ...(dateFilter ? { date: dateFilter } : {}) };

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: 'asc' },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = new Map();
  const dailyNet = new Map();

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);
    const key = dayKey(transaction.date);
    dailyNet.set(key, (dailyNet.get(key) ?? 0) + (transaction.type === 'INCOME' ? amount : -amount));

    if (transaction.type === 'INCOME') {
      totalIncome += amount;
    } else {
      totalExpense += amount;
      const categoryName = transaction.category?.name ?? 'Uncategorized';
      const categoryColor = transaction.category?.color ?? '#9e9e9e';
      const existing = categoryTotals.get(categoryName) ?? { name: categoryName, color: categoryColor, total: 0 };
      existing.total += amount;
      categoryTotals.set(categoryName, existing);
    }
  }

  const byCategory = Array.from(categoryTotals.values()).sort((a, b) => b.total - a.total);

  let runningBalance = 0;
  const balanceOverTime = Array.from(dailyNet.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, net]) => {
      runningBalance += net;
      return { date, balance: runningBalance };
    });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory,
    balanceOverTime,
  };
};

export const getBudgetProgress = async (userId, month) => {
  const targetMonth = dayjs(month && /^\d{4}-\d{2}$/.test(month) ? month : undefined);
  const start = targetMonth.startOf('month').toDate();
  const end = targetMonth.endOf('month').toDate();

  const [budgets, spentByCategory] = await Promise.all([
    prisma.budget.findMany({ where: { userId }, include: { category: true } }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'EXPENSE', date: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
  ]);

  const spentMap = new Map(spentByCategory.map((row) => [row.categoryId, Number(row._sum.amount ?? 0)]));

  return budgets.map((budget) => ({
    id: budget.id,
    categoryId: budget.categoryId,
    categoryName: budget.category.name,
    color: budget.category.color,
    amount: Number(budget.amount),
    spent: spentMap.get(budget.categoryId) ?? 0,
  }));
};
