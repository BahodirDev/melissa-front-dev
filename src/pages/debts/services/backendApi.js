/**
 * Backend API integration for Profit & Debt modules
 * Replace mockApi.js with this when backend is ready
 */

import { get } from "../../../customHook/api"

// Backend API endpoints
const API_BASE = process.env.REACT_APP_URL || ""

/**
 * Dashboard API - Backend calculates all metrics automatically
 * 
 * Backend should:
 * 1. Calculate profit metrics from invoices table:
 *    - SUM(profit) WHERE date BETWEEN period_start AND period_end
 *    - SUM(revenue) WHERE date BETWEEN period_start AND period_end
 *    - SUM(cost) WHERE date BETWEEN period_start AND period_end
 *    - Generate sparkline data (last 7 days aggregated)
 * 
 * 2. Calculate debt metrics from debt/transactions table:
 *    - SUM(outstanding) WHERE outstanding > 0
 *    - SUM(outstanding) WHERE overdue = true
 *    - COUNT(DISTINCT client_id) WHERE outstanding > 0
 *    - Generate sparkline data (last 7 days balance changes)
 */
export const dashboardApi = {
	getSummary: async (period = "today") => {
		// Calculate date range based on period
		const today = new Date()
		let from, to

		switch (period) {
			case "today":
				from = new Date(today.setHours(0, 0, 0, 0)).toISOString()
				to = new Date(today.setHours(23, 59, 59, 999)).toISOString()
				break
			case "week":
				const weekStart = new Date(today)
				weekStart.setDate(today.getDate() - 7)
				from = weekStart.toISOString()
				to = new Date().toISOString()
				break
			case "month":
				const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
				from = monthStart.toISOString()
				to = new Date().toISOString()
				break
			case "period":
				// Custom period - should be passed as params
				from = null
				to = null
				break
			default:
				from = new Date(today.setHours(0, 0, 0, 0)).toISOString()
				to = new Date(today.setHours(23, 59, 59, 999)).toISOString()
		}

		// Backend endpoint: GET /api/dashboard/summary?period=today&from=...&to=...
		const response = await get(
			`/api/dashboard/summary?period=${period}${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}`
		)

		return response
	},
}

/**
 * Expected Backend Response Format:
 * 
 * GET /api/dashboard/summary?period=today
 * 
 * Response:
 * {
 *   "status": 200,
 *   "data": {
 *     "profit": {
 *       "total": 450000,        // SUM(profit) from invoices
 *       "revenue": 1200000,     // SUM(revenue) from invoices
 *       "cost": 750000,         // SUM(cost) from invoices
 *       "sparkline": [120000, 150000, 180000, 200000, 220000, 250000, 450000]  // Last 7 days daily totals
 *     },
 *     "debt": {
 *       "outstanding": 450000,  // SUM(outstanding) from debt table
 *       "overdue": 320000,       // SUM(outstanding) WHERE overdue = true
 *       "active_clients": 8,     // COUNT(DISTINCT client_id) WHERE outstanding > 0
 *       "sparkline": [500000, 480000, 460000, 450000, 440000, 445000, 450000]  // Last 7 days balance
 *     }
 *   }
 * }
 */

/**
 * Backend SQL Example (PostgreSQL):
 * 
 * -- Profit calculation for today
 * SELECT 
 *   COALESCE(SUM(profit), 0) as total,
 *   COALESCE(SUM(revenue), 0) as revenue,
 *   COALESCE(SUM(cost), 0) as cost
 * FROM invoices
 * WHERE DATE(created_at) = CURRENT_DATE
 *   AND status = 'completed';
 * 
 * -- Sparkline data (last 7 days)
 * SELECT 
 *   DATE(created_at) as date,
 *   SUM(profit) as daily_profit
 * FROM invoices
 * WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
 *   AND status = 'completed'
 * GROUP BY DATE(created_at)
 * ORDER BY date ASC;
 * 
 * -- Debt calculation
 * SELECT 
 *   COALESCE(SUM(outstanding), 0) as outstanding,
 *   COALESCE(SUM(CASE WHEN overdue THEN outstanding ELSE 0 END), 0) as overdue,
 *   COUNT(DISTINCT client_id) FILTER (WHERE outstanding > 0) as active_clients
 * FROM client_debts
 * WHERE outstanding > 0;
 * 
 * -- Debt sparkline (last 7 days balance changes)
 * SELECT 
 *   DATE(created_at) as date,
 *   SUM(outstanding) as daily_balance
 * FROM client_debts
 * WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
 * GROUP BY DATE(created_at)
 * ORDER BY date ASC;
 */

export default dashboardApi

