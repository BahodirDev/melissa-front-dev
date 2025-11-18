/**
 * API service for Profit & Debt modules
 * NOTE: This file is deprecated. All components now use direct API calls via customHook/api
 * This file is kept for reference only and can be removed in the future.
 */

import { get, post } from "../../../customHook/api";

/**
 * @deprecated - Use direct API calls instead
 * All profit operations now use:
 * - GET /profit/list - for profit list
 * - GET /profit/detail/:invoice_id - for profit detail
 */
export const profitApi = {
  // This is deprecated - use direct API calls
};

/**
 * @deprecated - Use direct API calls instead
 * All dashboard operations now use:
 * - GET /profit/dashboard/summary - for dashboard summary
 * - GET /profit/dashboard/analysis - for dashboard analysis
 */
export const dashboardApi = {
  // This is deprecated - use direct API calls
};

/**
 * @deprecated - Use direct API calls instead
 * Get stores from: GET /store/store-list
 */
export const getStores = () => {
  // This is deprecated - use direct API calls
  return [];
};

/**
 * Debt API - Backend Integration
 * NOTE: This is also deprecated. Components use direct API calls now.
 * All debt operations use:
 * - GET /client-debts/list - for debt list
 * - GET /client-debts/ledger/:clientId - for debt ledger
 * - POST /client-debts/payment - for recording payments
 * - POST /client-debts/create - for creating debts
 */
export const debtApi = {
  // This is deprecated - use direct API calls
  getList: async (params = {}) => {
    const { page = 1, limit = 20, filter = null, search = null } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filter && filter !== "all") {
      queryParams.append("filter", filter);
    }

    if (search) {
      queryParams.append("search", search);
    }

    try {
      const response = await get(
        `/client-debts/list?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching debt list:", error);
      return {
        status: 500,
        error: "Ma'lumotlarni yuklashda xatolik",
      };
    }
  },

  getLedger: async (clientId, params = {}) => {
    const { from = null, to = null, type = null } = params;

    const queryParams = new URLSearchParams();
    if (from) queryParams.append("from", from);
    if (to) queryParams.append("to", to);
    if (type) queryParams.append("type", type);

    try {
      const queryString = queryParams.toString();
      const endpoint = `/client-debts/ledger/${clientId}${
        queryString ? `?${queryString}` : ""
      }`;
      const response = await get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching debt ledger:", error);
      return {
        status: 500,
        error: "Qarz tarixini yuklashda xatolik",
      };
    }
  },

  recordPayment: async (clientId, payment) => {
    const { amount, method, note } = payment;

    try {
      const response = await post("/client-debts/payment", {
        client_id: clientId,
        amount: amount,
        payment_method: method,
        note: note || null,
        client_debt_id: null,
      });
      return response;
    } catch (error) {
      console.error("Error recording payment:", error);
      return {
        status: 500,
        error: "To'lov qayd etishda xatolik",
      };
    }
  },

  createDebt: async (debtData) => {
    const { client_id, amount, due_date, note } = debtData;

    try {
      const response = await post("/client-debts/create", {
        client_id: client_id,
        amount: amount,
        due_date: due_date,
        note: note || null,
      });
      return response;
    } catch (error) {
      console.error("Error creating debt:", error);
      return {
        status: 500,
        error: "Qarz qo'shishda xatolik",
      };
    }
  },
};
