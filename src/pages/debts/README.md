# Profit & Debt UI/UX Mock

Bu modul melissa-store uchun foyda va qarz modullarining to'liq frontend prototipini taqdim etadi.

## Tuzilma

```
debts/
├── components/          # Umumiy komponentlar
│   ├── MetricCard.jsx
│   ├── DataTable.jsx
│   ├── Modal.jsx
│   ├── DateRangePicker.jsx
│   ├── EmptyState.jsx
│   ├── Skeleton.jsx
│   └── Confirmation.jsx
├── profit/              # Foyda moduli
│   ├── DashboardWidget.jsx
│   ├── ProfitList.jsx
│   └── ProfitDetailModal.jsx
├── debt/                # Qarz moduli
│   ├── DebtList.jsx
│   ├── DebtLedger.jsx
│   └── RecordPaymentModal.jsx
├── mockData/            # Mock ma'lumotlar
│   ├── profitList.json
│   ├── profitDetail.json
│   ├── debtList.json
│   ├── debtLedger.json
│   └── dashboardSummary.json
├── services/            # Mock API xizmatlari
│   └── mockApi.js
└── Debts.jsx           # Asosiy komponent
```

## Xususiyatlar

### Dashboard
- Foyda va qarz yig'ma ma'lumotlari
- Sparkline grafiklar
- Period tanlovi (Bugun, Hafta, Oy, Davr)
- Widget'larni bosish orqali tegishli ro'yxatga o'tish

### Foyda Moduli
- **ProfitList**: Foyda ro'yxati
  - Sana oralig'i filtri
  - Do'kon filtri
  - Min foyda filtri
  - Qidiruv (Invoice ID, mahsulot)
  - Saralash (sana, daromad, foyda)
  - Eksport (CSV, PDF)
  - Ko'p tanlash va bulk amallar
  
- **ProfitDetailModal**: Foyda tafsilotlari
  - Invoice ma'lumotlari
  - Mahsulotlar ro'yxati
  - Jami hisob-kitoblar
  - PDF yuklab olish
  - Admin uchun foyda tahrirlash (keyinchalik)

### Qarz Moduli
- **DebtList**: Mijozlar ro'yxati
  - Qidiruv (nomi, telefon)
  - Filtrlar (Muddat o'tgan, Faol, To'langan)
  - Qarz qoldig'i ko'rsatkichlari
  - Amallar (Ledger ko'rish, To'lov qayd etish, Eslatma)
  
- **DebtLedger**: Mijoz ledger'i
  - To'liq tarix
  - Sana va tur bo'yicha filtrlash
  - CSV eksport
  - To'lov qayd etish tugmasi
  
- **RecordPaymentModal**: To'lov qayd etish
  - Summa kiritish (validatsiya bilan)
  - Tezkor summa tanlovi (25%, 50%, 75%, 100%)
  - To'lov usuli (Naqd, Karta, O'tkazma)
  - Izoh qo'shish
  - Optimistic UI yangilanish
  - Tasdiqlash modali

## Mock API

Barcha API chaqiruqlar `services/mockApi.js` orqali amalga oshiriladi:

```javascript
import { profitApi, debtApi, dashboardApi } from './services/mockApi'

// Foyda ro'yxati
const response = await profitApi.getList({
  from: '2025-11-01',
  to: '2025-11-15',
  page: 1,
  limit: 20,
  store: 'toshkent-1',
  minProfit: 100000,
  search: 'INV-1001',
  sortBy: 'date',
  sortOrder: 'desc'
})

// Foyda tafsilotlari
const detail = await profitApi.getDetail('INV-2025-1001')

// Qarz ro'yxati
const debts = await debtApi.getList({
  page: 1,
  limit: 20,
  filter: 'overdue',
  search: 'Ali'
})

// Mijoz ledger'i
const ledger = await debtApi.getLedger('c1', {
  from: '2025-11-01',
  to: '2025-11-15',
  type: 'payment'
})

// To'lov qayd etish
const payment = await debtApi.recordPayment('c1', {
  amount: 50000,
  method: 'cash',
  note: 'Naqd to\'lov'
})

// Dashboard ma'lumotlari
const summary = await dashboardApi.getSummary('today')
```

## Mock Ma'lumotlar

Mock ma'lumotlar `mockData/` papkasida JSON formatida saqlanadi. Ular `mockApi.js` tomonidan ishlatiladi.

## Responsive Dizayn

- **Desktop (1440px)**: To'liq funksionallik
- **Tablet (768px)**: Adaptiv layout
- **Mobile (375px)**: Stack layout, full-screen modallar

## Accessibility

- Barcha interaktiv elementlar uchun ARIA label'lar
- Klaviatura navigatsiyasi (Tab, Enter, Esc)
- Focus outline'lar
- Rang kontrasti >= 4.5:1
- Screen reader qo'llab-quvvatlash

## Design System

### Ranglar
- Primary: `#1f2937` (dark slate)
- Accent: `#059669` (green)
- Danger: `#ef4444` (red)
- Background: `#f8fafc`
- Surface: `#ffffff`

### Spacing
- 8px grid tizimi
- Card padding: 16px
- Item gap: 12px
- Table row height: 48px

### Typography
- Font: Inter / system-ui
- H1: 20-24px
- Body: 14-16px

## Ishlatish

1. `Debts.jsx` komponenti asosiy sahifa sifatida ishlatiladi
2. Dashboard, Foyda, va Qarz o'rtasida switch orqali navigatsiya
3. Barcha ma'lumotlar mock API orqali olinadi
4. Real backend integratsiyasi uchun `services/mockApi.js` ni o'zgartiring

## Keyingi Qadamlar

- [ ] Real backend API integratsiyasi
- [ ] WebSocket realtime yangilanishlar
- [ ] Foyda tahrirlash modali (admin)
- [ ] PDF/CSV eksport funksiyalari
- [ ] Virtualization katta ro'yxatlar uchun
- [ ] Offline cache qo'llab-quvvatlash
- [ ] Unit testlar
- [ ] E2E testlar

## Test Case'lar

### Foyda Moduli
1. ✅ Sana oralig'i filtri faqat tanlangan davrdagi elementlarni ko'rsatadi
2. ✅ Foyda tafsilotlarida jami summa mahsulotlar yig'indisiga teng
3. ✅ Saralash to'g'ri ishlaydi
4. ✅ Eksport tugmalari mavjud

### Qarz Moduli
1. ✅ To'lov qayd etish qarz qoldig'ini yangilaydi
2. ✅ Ledger'ga yangi yozuv qo'shiladi
3. ✅ Summa validatsiyasi (qoldiqdan oshmasligi)
4. ✅ Optimistic UI yangilanish
5. ✅ Socket yangilanishi konflikt banner ko'rsatadi

## Eslatmalar

- Barcha matnlar o'zbek (lotin) tilida
- Komponent nomlari ingliz tilida qolgan
- Mock API 300-500ms kechikish bilan ishlaydi (real network simulyatsiyasi)
- Dark mode qo'llab-quvvatlanadi

