import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import prisma from '../lib/prisma.js';

const listCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { OR: [{ userId: null }, { userId: req.user.id }] },
    orderBy: { name: 'asc' },
  });
  res.json({ categories });
};

const createCategory = async (req, res) => {
  const { name, type, icon, color, keywords } = req.body;
  if (!name || !type) {
    throw HttpError(400, 'Name and type are required');
  }

  const category = await prisma.category.create({
    data: {
      name,
      type,
      icon,
      color,
      keywords: keywords ?? [],
      userId: req.user.id,
    },
  });

  res.status(201).json({ category });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.userId !== req.user.id) {
    throw HttpError(404, 'Category not found');
  }

  const { name, type, icon, color, keywords } = req.body;
  const updated = await prisma.category.update({
    where: { id },
    data: { name, type, icon, color, keywords },
  });

  res.json({ category: updated });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || (category.userId !== req.user.id && !category.isDefault)) {
    throw HttpError(404, 'Category not found');
  }
  if (category.isDefault) {
    throw HttpError(400, 'Default categories cannot be deleted');
  }

  await prisma.category.delete({ where: { id } });
  res.status(204).send();
};

export default {
  listCategories: ctrlWrapper(listCategories),
  createCategory: ctrlWrapper(createCategory),
  updateCategory: ctrlWrapper(updateCategory),
  deleteCategory: ctrlWrapper(deleteCategory),
};
