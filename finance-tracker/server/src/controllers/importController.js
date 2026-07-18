import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import prisma from '../lib/prisma.js';
import { parseCsvBuffer, detectMapping, resolveRowAmount } from '../services/csvImportService.js';
import { matchCategory } from '../services/categoryMatcher.js';

const previewImport = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, 'CSV file is required');
  }

  let records;
  try {
    records = parseCsvBuffer(req.file.buffer);
  } catch {
    throw HttpError(400, 'Could not parse CSV file');
  }

  if (records.length === 0) {
    throw HttpError(400, 'CSV file is empty');
  }

  const headers = Object.keys(records[0]);
  const mapping = detectMapping(headers);

  const categories = await prisma.category.findMany({
    where: { OR: [{ userId: null }, { userId: req.user.id }] },
  });

  const rows = records.map((record, index) => {
    const description = mapping.description ? record[mapping.description] : '';
    const dateRaw = mapping.date ? record[mapping.date] : '';
    const { amount, type } = resolveRowAmount(record, mapping);
    const suggestedCategory = matchCategory(description, categories, type);

    return {
      index,
      date: dateRaw,
      description,
      amount,
      type,
      suggestedCategoryId: suggestedCategory?.id ?? null,
    };
  });

  res.json({ headers, mapping, rows });
};

const confirmImport = async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw HttpError(400, 'No rows to import');
  }

  const data = rows.map((row) => ({
    amount: Math.abs(Number(row.amount)) || 0,
    type: row.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
    date: new Date(row.date),
    note: row.note || null,
    categoryId: row.categoryId || null,
    userId: req.user.id,
    source: 'CSV',
  }));

  const invalid = data.find((row) => Number.isNaN(row.date.getTime()));
  if (invalid) {
    throw HttpError(400, 'One or more rows have an invalid date');
  }

  const result = await prisma.transaction.createMany({ data });

  res.status(201).json({ count: result.count });
};

export default {
  previewImport: ctrlWrapper(previewImport),
  confirmImport: ctrlWrapper(confirmImport),
};
