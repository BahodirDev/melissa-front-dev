# Dashboard Yangi Funksiyalar

## Qo'shilgan Funksiyalar ✨

### 1. Davrlar Bo'yicha Taqqoslash (Period Comparison)

Dashboard endi joriy davrni oldingi davr bilan avtomatik taqqoslaydi:

**Taqqoslash:**
- **Bugun** vs **Kecha**
- **Bu hafta** vs **O'tgan hafta**
- **Bu oy** vs **O'tgan oy**
- **Bu yil** vs **O'tgan yil**

**Ko'rsatiladi:**
- Joriy va oldingi davr qiymatlari
- Foiz o'zgarish (o'sish/kamayish)
- Trend ko'rsatkichlari (↑ o'sish, ↓ kamayish)
- Foyda, daromad, xarajat bo'yicha taqqoslash

**Komponent:** `PeriodComparison.jsx`

### 2. Foyda Omillari Tahlili (Profit Analysis)

Qaysi omillar foydani oshirayotganini ko'rsatadi:

**Tahlil qismlari:**

1. **Eng ko'p foyda keltirgan mahsulotlar**
   - Top 5 mahsulot
   - Har birining foyda summasi
   - Bar chart visualizatsiyasi

2. **Eng ko'p foyda keltirgan do'konlar**
   - Top 5 do'kon
   - Har birining foyda summasi
   - Bar chart visualizatsiyasi

3. **Vaqt bo'yicha taqsimot**
   - 08:00-12:00 (ertalab)
   - 12:00-16:00 (tushdan keyin)
   - 16:00-20:00 (kechqurun)
   - Qaysi vaqt eng samarali

4. **Asosiy xulosalar**
   - Avtomatik generatsiya qilingan insight'lar
   - Eng muhim ma'lumotlar

**Komponent:** `ProfitAnalysis.jsx`

## Backend API Endpoints

### 1. Summary with Comparison

```
GET /api/dashboard/summary?period=today
```

**Response:**
```json
{
  "profit": { /* joriy davr */ },
  "previous_profit": { /* oldingi davr */ },
  "debt": { /* qarz ma'lumotlari */ }
}
```

### 2. Profit Analysis

```
GET /api/dashboard/analysis?period=today
```

**Response:**
```json
{
  "top_products": [...],
  "top_stores": [...],
  "time_breakdown": [...],
  "insights": [...]
}
```

## Backend SQL Queries

### Top Products Query

```sql
SELECT 
  p.product_name as name,
  SUM(i.profit) as profit,
  SUM(i.revenue) as revenue,
  SUM(i.cost) as cost
FROM invoice_items i
JOIN products p ON i.product_id = p.product_id
JOIN invoices inv ON i.invoice_id = inv.invoice_id
WHERE inv.created_at BETWEEN :from AND :to
  AND inv.status = 'completed'
GROUP BY p.product_name
ORDER BY SUM(i.profit) DESC
LIMIT 10
```

### Top Stores Query

```sql
SELECT 
  s.store_name as name,
  SUM(inv.profit) as profit,
  SUM(inv.revenue) as revenue,
  SUM(inv.cost) as cost
FROM invoices inv
JOIN stores s ON inv.store_id = s.store_id
WHERE inv.created_at BETWEEN :from AND :to
  AND inv.status = 'completed'
GROUP BY s.store_name
ORDER BY SUM(inv.profit) DESC
LIMIT 10
```

### Time Breakdown Query

```sql
SELECT 
  CASE 
    WHEN EXTRACT(HOUR FROM created_at) BETWEEN 8 AND 11 THEN '08:00-12:00'
    WHEN EXTRACT(HOUR FROM created_at) BETWEEN 12 AND 15 THEN '12:00-16:00'
    WHEN EXTRACT(HOUR FROM created_at) BETWEEN 16 AND 19 THEN '16:00-20:00'
    ELSE '20:00-08:00'
  END as label,
  SUM(profit) as profit,
  SUM(revenue) as revenue,
  SUM(cost) as cost
FROM invoices
WHERE created_at BETWEEN :from AND :to
  AND status = 'completed'
GROUP BY label
ORDER BY label
```

## Frontend Komponentlar

1. **PeriodComparison.jsx** - Davrlar bo'yicha taqqoslash
2. **ProfitAnalysis.jsx** - Foyda omillari tahlili (Chart.js bilan)
3. **DashboardWidget.jsx** - Yangilangan (taqqoslash va tahlil qo'shilgan)

## Visual Features

- **Bar Charts** - Mahsulotlar, do'konlar, vaqt bo'yicha foyda
- **Trend Indicators** - O'sish/kamayish ko'rsatkichlari
- **Color Coding** - Yashil (o'sish), Qizil (kamayish)
- **Responsive Design** - Barcha ekranlar uchun

## Ma'lumotlar Yangilanishi

- Dashboard ma'lumotlari har safar period o'zgarganda yangilanadi
- Taqqoslash va tahlil ma'lumotlari parallel yuklanadi
- Loading state'lar alohida ko'rsatiladi

