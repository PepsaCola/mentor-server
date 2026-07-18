import { parse } from 'csv-parse/sync';

const DATE_ALIASES = ['date', 'posted date', 'transaction date'];
const DESCRIPTION_ALIASES = ['description', 'memo', 'details', 'payee'];
const AMOUNT_ALIASES = ['amount'];
const DEBIT_ALIASES = ['debit', 'withdrawal'];
const CREDIT_ALIASES = ['credit', 'deposit'];

const findHeader = (headers, aliases) =>
  headers.find((header) => aliases.includes(header.trim().toLowerCase()));

export const parseCsvBuffer = (buffer) =>
  parse(buffer, { columns: true, skip_empty_lines: true, trim: true });

export const detectMapping = (headers) => ({
  date: findHeader(headers, DATE_ALIASES) ?? null,
  description: findHeader(headers, DESCRIPTION_ALIASES) ?? null,
  amount: findHeader(headers, AMOUNT_ALIASES) ?? null,
  debit: findHeader(headers, DEBIT_ALIASES) ?? null,
  credit: findHeader(headers, CREDIT_ALIASES) ?? null,
});

export const parseAmount = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const cleaned = String(value).replace(/[$,]/g, '').trim();
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const resolveRowAmount = (record, mapping) => {
  if (mapping.amount) {
    const value = parseAmount(record[mapping.amount]);
    return { amount: Math.abs(value), type: value < 0 ? 'EXPENSE' : 'INCOME' };
  }

  const debitValue = mapping.debit ? parseAmount(record[mapping.debit]) : 0;
  const creditValue = mapping.credit ? parseAmount(record[mapping.credit]) : 0;

  if (debitValue) {
    return { amount: Math.abs(debitValue), type: 'EXPENSE' };
  }
  return { amount: Math.abs(creditValue), type: 'INCOME' };
};
