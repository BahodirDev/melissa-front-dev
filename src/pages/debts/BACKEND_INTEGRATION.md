# Backend Integration Guide

## Dashboard Data Calculation

Dashboard ma'lumotlari **avtomatik ravishda backend tomonidan hisoblanadi**. Hech qanday manual kiritish kerak emas.

### Yangi Funksiyalar ✨

1. **Davrlar bo'yicha taqqoslash** - Joriy davr oldingi davr bilan taqqoslanadi
2. **Foyda omillari tahlili** - Qaysi omillar foydani oshirayotganini ko'rsatadi

### Ma'lumotlar manbasi

1. **Foyda ma'lumotlari** - `invoices` jadvalidan:

   - Har bir invoice'da `profit`, `revenue`, `cost` maydonlari mavjud
   - Backend tanlangan davr uchun bu qiymatlarni yig'adi

2. **Qarz ma'lumotlari** - `client_debts` yoki `transactions` jadvalidan:
   - Har bir mijoz uchun `outstanding` balans
   - `overdue` flag (muddat o'tgan yoki yo'q)
   - Backend barcha mijozlarning qarzlarini yig'adi

### Backend API Endpoints

#### 1. Dashboard Summary (with Comparison)

```
GET /api/dashboard/summary?period=today&from=2025-11-15T00:00:00Z&to=2025-11-15T23:59:59Z
```

**Query Parameters:**

- `period`: `today`, `week`, `month`, `year`, `period`
- `from`: ISO date string (optional, for custom period)
- `to`: ISO date string (optional, for custom period)

**Response Format:**

```json
{
  "status": 200,
  "data": {
    "profit": {
      "total": 450000,
      "revenue": 1200000,
      "cost": 750000,
      "sparkline": [120000, 150000, 180000, 200000, 220000, 250000, 450000]
    },
    "previous_profit": {
      "total": 380000,
      "revenue": 1050000,
      "cost": 670000,
      "sparkline": [100000, 120000, 150000, 180000, 200000, 220000, 380000]
    },
    "debt": {
      "outstanding": 450000,
      "overdue": 320000,
      "active_clients": 8,
      "sparkline": [500000, 480000, 460000, 450000, 440000, 445000, 450000]
    }
  }
}
```

**Previous Period Mapping:**

- `today` → `yesterday` (kecha)
- `week` → `last_week` (o'tgan hafta)
- `month` → `last_month` (o'tgan oy)
- `year` → `last_year` (o'tgan yil)

#### 2. Profit Analysis

```
GET /api/dashboard/analysis?period=today&from=2025-11-15T00:00:00Z&to=2025-11-15T23:59:59Z
```

**Response Format:**

```json
{
  "status": 200,
  "data": {
    "top_products": [
      {
        "name": "olma",
        "profit": 150000,
        "revenue": 300000,
        "cost": 150000
      }
    ],
    "top_stores": [
      {
        "name": "Toshkent-1",
        "profit": 250000,
        "revenue": 600000,
        "cost": 350000
      }
    ],
    "time_breakdown": [
      {
        "label": "08:00-12:00",
        "profit": 150000,
        "revenue": 400000,
        "cost": 250000
      }
    ],
    "insights": [
      "Eng ko'p foyda keltirgan mahsulot: olma (150,000 so'm)",
      "Eng samarali do'kon: Toshkent-1 (250,000 so'm foyda)",
      "Eng faol vaqt: 12:00-16:00 (200,000 so'm foyda)",
      "Foyda o'sishi: o'tgan davrga nisbatan +18.4%"
    ]
  }
}
```

### Backend Implementation Example

#### Node.js/Express Example:

```javascript
// routes/dashboard.js
router.get("/summary", async (req, res) => {
  const { period, from, to } = req.query;

  // Calculate date range
  const dateRange = calculateDateRange(period, from, to);

  // Calculate profit metrics
  const profitMetrics = await db.query(
    `
    SELECT 
      COALESCE(SUM(profit), 0) as total,
      COALESCE(SUM(revenue), 0) as revenue,
      COALESCE(SUM(cost), 0) as cost
    FROM invoices
    WHERE created_at BETWEEN $1 AND $2
      AND status = 'completed'
  `,
    [dateRange.from, dateRange.to]
  );

  // Get sparkline data (last 7 days)
  const sparklineData = await db.query(`
    SELECT 
      DATE(created_at) as date,
      SUM(profit) as daily_profit
    FROM invoices
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status = 'completed'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);

  // Calculate debt metrics
  const debtMetrics = await db.query(`
    SELECT 
      COALESCE(SUM(outstanding), 0) as outstanding,
      COALESCE(SUM(CASE WHEN overdue THEN outstanding ELSE 0 END), 0) as overdue,
      COUNT(DISTINCT client_id) FILTER (WHERE outstanding > 0) as active_clients
    FROM client_debts
    WHERE outstanding > 0
  `);

  // Get debt sparkline
  const debtSparkline = await db.query(`
    SELECT 
      DATE(updated_at) as date,
      SUM(outstanding) as daily_balance
    FROM client_debts
    WHERE updated_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(updated_at)
    ORDER BY date ASC
  `);

  res.json({
    status: 200,
    data: {
      profit: {
        total: profitMetrics.rows[0].total,
        revenue: profitMetrics.rows[0].revenue,
        cost: profitMetrics.rows[0].cost,
        sparkline: sparklineData.rows.map((r) => r.daily_profit),
      },
      debt: {
        outstanding: debtMetrics.rows[0].outstanding,
        overdue: debtMetrics.rows[0].overdue,
        active_clients: debtMetrics.rows[0].active_clients,
        sparkline: debtSparkline.rows.map((r) => r.daily_balance),
      },
    },
  });
});
```

#### Python/Django Example:

```python
# views/dashboard.py
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

def get_dashboard_summary(request):
    period = request.GET.get('period', 'today')

    # Calculate date range
    today = timezone.now().date()
    if period == 'today':
        date_from = today
        date_to = today
    elif period == 'week':
        date_from = today - timedelta(days=7)
        date_to = today
    elif period == 'month':
        date_from = today.replace(day=1)
        date_to = today

    # Calculate profit metrics
    profit_data = Invoice.objects.filter(
        created_at__date__gte=date_from,
        created_at__date__lte=date_to,
        status='completed'
    ).aggregate(
        total=Sum('profit'),
        revenue=Sum('revenue'),
        cost=Sum('cost')
    )

    # Get sparkline (last 7 days)
    sparkline_dates = [today - timedelta(days=i) for i in range(6, -1, -1)]
    sparkline = [
        Invoice.objects.filter(
            created_at__date=date,
            status='completed'
        ).aggregate(total=Sum('profit'))['total'] or 0
        for date in sparkline_dates
    ]

    # Calculate debt metrics
    debt_data = ClientDebt.objects.filter(
        outstanding__gt=0
    ).aggregate(
        outstanding=Sum('outstanding'),
        overdue=Sum('outstanding', filter=Q(overdue=True)),
        active_clients=Count('client_id', distinct=True)
    )

    return JsonResponse({
        'status': 200,
        'data': {
            'profit': {
                'total': profit_data['total'] or 0,
                'revenue': profit_data['revenue'] or 0,
                'cost': profit_data['cost'] or 0,
                'sparkline': sparkline
            },
            'debt': {
                'outstanding': debt_data['outstanding'] or 0,
                'overdue': debt_data['overdue'] or 0,
                'active_clients': debt_data['active_clients'] or 0,
                'sparkline': []  # Calculate similarly
            }
        }
    })
```

### Frontend Integration

Frontend'da `mockApi.js` o'rniga `backendApi.js` ishlatish:

```javascript
// src/pages/debts/services/mockApi.js ni o'zgartiring:

// OLD (mock):
import dashboardSummaryData from "../mockData/dashboardSummary.json";
export const dashboardApi = {
  getSummary: async (period) => {
    return { status: 200, data: { ...dashboardSummaryData } };
  },
};

// NEW (backend):
import { get } from "../../../customHook/api";
export const dashboardApi = {
  getSummary: async (period) => {
    const response = await get(`/api/dashboard/summary?period=${period}`);
    return response;
  },
};
```

### Xulosa

- Dashboard ma'lumotlari **avtomatik hisoblanadi** - manual kiritish kerak emas
- Backend invoice va debt jadvallaridan yig'adi
- Sparkline ma'lumotlari oxirgi 7 kunlik kunlik yig'indilardan tayyorlanadi
- Real vaqtda yangilanadi (har safar API chaqirilganda)
