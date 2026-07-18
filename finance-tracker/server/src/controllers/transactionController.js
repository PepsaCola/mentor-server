import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import prisma from '../lib/prisma.js';

const buildDateFilter = (from, to) => {
  if (!from && !to) return undefined;
  const filter = {};
  if (from) filter.gte = new Date(from);
  if (to) filter.lte = new Date(to);
  return filter;
};

const listTransactions = async (req, res) => {
  const { from, to, categoryId, type, page = 1, limit = 50 } = req.query;

  const where = {
    userId: req.user.id,
    ...(categoryId ? { categoryId } : {}),
    ...(type ? { type } : {}),
    ...(buildDateFilter(from, to) ? { date: buildDateFilter(from, to) } : {}),
  };

  const take = Math.min(Number(limit) || 50, 200);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      take,
      skip,
    }),
    prisma.transaction.count({ where }),
  ]);

  res.json({ transactions, total, page: Number(page) || 1, limit: take });
};

const createTransaction = async (req, res) => {
  const { amount, type, date, note, categoryId } = req.body;
  if (amount === undefined || !type || !date) {
    throw HttpError(400, 'Amount, type and date are required');
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      date: new Date(date),
      note,
      categoryId: categoryId || null,
      userId: req.user.id,
      source: 'MANUAL',
    },
    include: { category: true },
  });

  res.status(201).json({ transaction });
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.user.id) {
    throw HttpError(404, 'Transaction not found');
  }

  const { amount, type, date, note, categoryId } = req.body;
  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...(amount !== undefined ? { amount } : {}),
      ...(type ? { type } : {}),
      ...(date ? { date: new Date(date) } : {}),
      ...(note !== undefined ? { note } : {}),
      ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
    },
    include: { category: true },
  });

  res.json({ transaction });
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.user.id) {
    throw HttpError(404, 'Transaction not found');
  }

  await prisma.transaction.delete({ where: { id } });
  res.status(204).send();
};

export default {
  listTransactions: ctrlWrapper(listTransactions),
  createTransaction: ctrlWrapper(createTransaction),
  updateTransaction: ctrlWrapper(updateTransaction),
  deleteTransaction: ctrlWrapper(deleteTransaction),
};
