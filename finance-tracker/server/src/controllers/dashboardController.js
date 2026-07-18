import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { getDashboardSummary } from '../services/dashboardService.js';

const getSummary = async (req, res) => {
  const { from, to } = req.query;
  const summary = await getDashboardSummary(req.user.id, { from, to });
  res.json(summary);
};

export default {
  getSummary: ctrlWrapper(getSummary),
};
