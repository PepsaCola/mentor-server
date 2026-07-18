import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { getDashboardSummary, getBudgetProgress } from '../services/dashboardService.js';

const getSummary = async (req, res) => {
  const { from, to } = req.query;
  const summary = await getDashboardSummary(req.user.id, { from, to });
  res.json(summary);
};

const getBudgets = async (req, res) => {
  const { month } = req.query;
  const progress = await getBudgetProgress(req.user.id, month);
  res.json({ progress });
};

export default {
  getSummary: ctrlWrapper(getSummary),
  getBudgets: ctrlWrapper(getBudgets),
};
