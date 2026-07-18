import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import prisma from '../lib/prisma.js';

const listBudgets = async (req, res) => {
  const budgets = await prisma.budget.findMany({
    where: { userId: req.user.id },
    include: { category: true },
  });
  res.json({ budgets });
};

const upsertBudget = async (req, res) => {
  const { categoryId, amount } = req.body;
  if (!categoryId || amount === undefined || Number(amount) <= 0) {
    throw HttpError(400, 'categoryId and a positive amount are required');
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, OR: [{ userId: null }, { userId: req.user.id }] },
  });
  if (!category) {
    throw HttpError(404, 'Category not found');
  }

  const budget = await prisma.budget.upsert({
    where: { userId_categoryId: { userId: req.user.id, categoryId } },
    update: { amount },
    create: { userId: req.user.id, categoryId, amount },
    include: { category: true },
  });

  res.status(201).json({ budget });
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget || budget.userId !== req.user.id) {
    throw HttpError(404, 'Budget not found');
  }

  await prisma.budget.delete({ where: { id } });
  res.status(204).send();
};

export default {
  listBudgets: ctrlWrapper(listBudgets),
  upsertBudget: ctrlWrapper(upsertBudget),
  deleteBudget: ctrlWrapper(deleteBudget),
};
