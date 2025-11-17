/**
 * Mock API service for Profit & Debt modules
 * Simulates backend API calls with mock data
 */

import profitListData from "../mockData/profitList.json";
import profitDetailData from "../mockData/profitDetail.json";
import debtListData from "../mockData/debtList.json";
import debtLedgerData from "../mockData/debtLedger.json";
import dashboardSummaryData from "../mockData/dashboardSummary.json";

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mock Profit API
export const profitApi = {
  // Get profit list with filters
  getList: async (params = {}) => {
    await delay(300);
    const {
      from,
      to,
      page = 1,
      limit = 20,
      store,
      minProfit,
      search,
      sortBy = "date",
      sortOrder = "desc",
    } = params;

    let data = [...profitListData.data];

    // Filter by date range
    if (from || to) {
      data = data.filter((item) => {
        const itemDate = new Date(item.date);
        if (from && itemDate < new Date(from)) return false;
        if (to && itemDate > new Date(to)) return false;
        return true;
      });
    }

    // Filter by store
    if (store) {
      data = data.filter((item) => item.store === store);
    }

    // Filter by min profit
    if (minProfit) {
      data = data.filter((item) => item.profit >= minProfit);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.invoice_id.toLowerCase().includes(searchLower) ||
          item.store.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    data.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "date") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = data.slice(start, end);

    return {
      status: 200,
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.length,
        data: paginatedData,
      },
    };
  },

  // Get profit detail
  getDetail: async (invoiceId) => {
    await delay(200);
    if (invoiceId === "INV-2025-1001") {
      return {
        status: 200,
        data: profitDetailData,
      };
    }
    // Return modified detail for other invoices
    return {
      status: 200,
      data: {
        ...profitDetailData,
        invoice_id: invoiceId,
      },
    };
  },

  // Adjust profit (admin only)
  adjustProfit: async (invoiceId, adjustment) => {
    await delay(400);
    const { cost_delta, note } = adjustment;
    const detail = await profitApi.getDetail(invoiceId);
    if (detail.status === 200) {
      // Simulate adjustment
      const updatedDetail = {
        ...detail.data,
        totals: {
          ...detail.data.totals,
          cost: detail.data.totals.cost + (cost_delta || 0),
          profit: detail.data.totals.profit - (cost_delta || 0),
        },
        adjustment_note: note,
        adjusted_at: new Date().toISOString(),
      };
      return {
        status: 200,
        data: updatedDetail,
      };
    }
    return {
      status: 400,
      error: "Invoice not found",
    };
  },
};

// Mock Debt API
export const debtApi = {
  // Get debt list
  getList: async (params = {}) => {
    await delay(300);
    const { page = 1, limit = 20, filter, search } = params;

    let data = [...debtListData.data];

    // Filter by status
    if (filter === "overdue") {
      data = data.filter((item) => item.overdue === true);
    } else if (filter === "active") {
      data = data.filter((item) => item.outstanding > 0 && !item.overdue);
    } else if (filter === "cleared") {
      data = data.filter((item) => item.outstanding === 0);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.phone.includes(search)
      );
    }

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = data.slice(start, end);

    return {
      status: 200,
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.length,
        data: paginatedData,
      },
    };
  },

  // Get debt ledger for a client
  getLedger: async (clientId, params = {}) => {
    await delay(250);
    const { from, to, type } = params;

    let history = [...debtLedgerData.history];

    // Filter by date range
    if (from || to) {
      history = history.filter((item) => {
        const itemDate = new Date(item.date);
        if (from && itemDate < new Date(from)) return false;
        if (to && itemDate > new Date(to)) return false;
        return true;
      });
    }

    // Filter by type
    if (type) {
      history = history.filter((item) => item.type === type);
    }

    // Sort by date descending
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      status: 200,
      data: {
        ...debtLedgerData,
        client_id: clientId,
        history,
      },
    };
  },

  // Record payment
  recordPayment: async (clientId, payment) => {
    await delay(500);
    const { amount, method, note } = payment;

    // Get current ledger
    const ledgerResponse = await debtApi.getLedger(clientId);
    if (ledgerResponse.status !== 200) {
      return {
        status: 400,
        error: "Client not found",
      };
    }

    const ledger = ledgerResponse.data;
    const newBalance = Math.max(0, ledger.balance - amount);

    const newEntry = {
      id: `h${Date.now()}`,
      date: new Date().toISOString(),
      type: "payment",
      amount: amount,
      balance_after: newBalance,
      note: note || `${method} payment`,
      operator: "Current User",
    };

    return {
      status: 200,
      data: {
        client_id: clientId,
        balance: newBalance,
        entry: newEntry,
      },
    };
  },

  // Create new debt (manual)
  createDebt: async (debtData) => {
    await delay(400);
    const { client_id, amount, due_date, note } = debtData;

    // Check if client exists
    const clientList = await debtApi.getList({});
    const client = clientList.data.data.find((c) => c.client_id === client_id);

    if (!client) {
      return {
        status: 400,
        error: "Client not found",
      };
    }

    // Create new debt entry
    const newDebt = {
      client_id: client_id,
      debt_id: `d${Date.now()}`,
      amount: amount,
      outstanding: amount,
      due_date: due_date,
      overdue: new Date(due_date) < new Date(),
      created_at: new Date().toISOString(),
      note: note,
    };

    // In real app, this would be saved to backend
    // For mock, we just return success

    return {
      status: 200,
      data: {
        ...newDebt,
        client_name: client.name,
        client_phone: client.phone,
      },
    };
  },
};

// Mock Dashboard API
export const dashboardApi = {
  getSummary: async (period = "today") => {
    await delay(200);

    // Get current period data
    const currentPeriod =
      dashboardSummaryData.profit[period] || dashboardSummaryData.profit.today;

    // Get previous period data for comparison
    const previousPeriodMap = {
      today: dashboardSummaryData.profit.yesterday,
      week: dashboardSummaryData.profit.last_week,
      month: dashboardSummaryData.profit.last_month,
      year: dashboardSummaryData.profit.last_year,
      period: dashboardSummaryData.profit.last_month, // Default to last month for custom period
    };
    const previousPeriod = previousPeriodMap[period] || null;

    return {
      status: 200,
      data: {
        profit: currentPeriod,
        previous_profit: previousPeriod,
        debt: dashboardSummaryData.debt,
      },
    };
  },

  getAnalysis: async (period = "today") => {
    await delay(300);
    return {
      status: 200,
      data: dashboardSummaryData.analysis,
    };
  },
};

// Export stores list (mock)
export const getStores = () => {
  return [
    { value: "toshkent-1", label: "Toshkent-1" },
    { value: "toshkent-2", label: "Toshkent-2" },
    { value: "samarqand", label: "Samarqand" },
    { value: "buxoro", label: "Buxoro" },
  ];
};
