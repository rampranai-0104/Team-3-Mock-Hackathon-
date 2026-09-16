const { getDashboardKPIs } = require('../../services/analyticsService');
const { sendSuccess, sendError } = require('../../utils/apiResponse');

/**
 * GET /api/admin/dashboard
 * Retrieves high-level platform KPI summary for admin overview
 */
const getDashboardData = async (req, res) => {
  try {
    const kpis = await getDashboardKPIs();
    return sendSuccess(res, 'Dashboard data retrieved successfully', kpis);
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    return sendError(res, 'Failed to retrieve dashboard data', error.message, 500);
  }
};

module.exports = {
  getDashboardData
};
