# Qarz (Debt) Bo'limi - Qanday Ishlaydi?

## Umumiy Ma'lumot

Qarz bo'limi mijozlarning qarzlarini boshqarish uchun yaratilgan. U quyidagi funksiyalarni ta'minlaydi:

1. ✅ **Qarz ro'yxatini ko'rish** - Barcha mijozlarning qarz qoldiqlari
2. ✅ **Qarz ledger'ini ko'rish** - Mijozning to'liq qarz tarixi
3. ✅ **To'lov qayd etish** - Mijoz to'lovini qayd etish
4. ✅ **Yangi qarz qo'shish** - Qo'lda qarz qo'shish (yangi funksiya)

## Qarz Qanday Yaratiladi?

### 1. Avtomatik Yaratish (Asosiy Usul) ⭐

Qarz **odatda sotuv jarayonida avtomatik yaratiladi**:

```
Sotuv jarayoni:
├─ Mijoz mahsulot sotib oladi
├─ To'lov to'liq emas?
│  ├─ Ha → Backend qarz yaratadi
│  │   ├─ Invoice yaratiladi
│  │   ├─ Qarz yozuvi yaratiladi (client_debts jadvalida)
│  │   └─ Ledger'ga "sale" yozuvi qo'shiladi
│  └─ Yo'q → Qarz yaratilmaydi
```

**Backend misoli:**
```javascript
// Invoice yaratilganda
POST /api/invoices
{
  client_id: "c1",
  items: [...],
  payment_method: "credit",  // yoki "partial"
  paid_amount: 50000,
  total_amount: 200000
}

// Backend avtomatik qarz yaratadi:
INSERT INTO client_debts (
  client_id, invoice_id, amount, outstanding, due_date
) VALUES (
  'c1', 'INV-1001', 150000, 150000, '2025-12-15'
)

INSERT INTO debt_history (
  client_id, type, amount, balance_after, note
) VALUES (
  'c1', 'sale', 150000, 150000, 'invoice INV-1001'
)
```

### 2. Manual Qarz Qo'shish (Yangi Funksiya) ✨

Agar qo'lda qarz qo'shish kerak bo'lsa:

1. **Qarz bo'limiga o'ting**
2. **"Yangi qarz qo'shish" tugmasini bosing**
3. **Formani to'ldiring:**
   - Mijoz tanlang
   - Qarz summasi
   - Muddat (due date)
   - Izoh (ixtiyoriy)
4. **"Qo'shish" tugmasini bosing**

**Backend API:**
```
POST /api/debt/create
Body: {
  client_id: "c1",
  amount: 200000,
  due_date: "2025-12-15",
  note: "Qo'lda qarz qo'shildi"
}
```

## Qarz Bo'limi Funksiyalari

### 1. Qarz Ro'yxati (DebtList)

**Ko'rsatadi:**
- Mijoz nomi va telefon
- Qarz qoldig'i (outstanding balance)
- Oxirgi to'lov sanasi
- Holat (Muddat o'tgan, Faol, To'langan)

**Filtrlar:**
- Barchasi
- Muddat o'tgan (overdue)
- Faol (active)
- To'langan (cleared)

**Amallar:**
- 👁️ Ledger ko'rish
- 💵 To'lov qayd etish
- 🔔 Eslatma yuborish
- ➕ Yangi qarz qo'shish (yangi)

### 2. Qarz Ledger (DebtLedger)

**Ko'rsatadi:**
- Mijozning to'liq qarz tarixi
- Har bir operatsiya:
  - **Sotuv** (sale) - Qarz qo'shilgan
  - **To'lov** (payment) - Qarz kamaygan
  - **Yozib olish** (writeoff) - Qarz bekor qilingan

**Filtrlar:**
- Sana oralig'i
- Operatsiya turi (sale, payment, writeoff)

**Amallar:**
- CSV eksport
- To'lov qayd etish

### 3. To'lov Qayd Etish (RecordPaymentModal)

**Funksiyalar:**
- Summa kiritish (validatsiya bilan)
- Tezkor summa tanlovi (25%, 50%, 75%, 100%)
- To'lov usuli (Naqd, Karta, O'tkazma)
- Izoh qo'shish
- Optimistic UI yangilanish

**Backend API:**
```
POST /api/debt/:client_id/payment
Body: {
  amount: 50000,
  method: "cash",
  note: "Naqd to'lov"
}

// Backend:
// 1. Qarz qoldig'ini yangilaydi
// 2. Ledger'ga yozuv qo'shiladi
// 3. Agar qarz to'liq to'landi, overdue = false
```

## Ma'lumotlar Oqimi

```
1. SOTUV
   └─ Invoice yaratiladi (to'lov to'liq emas)
      └─ Qarz yaratiladi (avtomatik)
         └─ Ledger'ga "sale" yozuvi

2. QARZ BO'LIMI
   └─ Qarz ro'yxati ko'rsatiladi
      └─ Mijoz tanlanadi
         └─ Ledger ko'rsatiladi

3. TO'LOV
   └─ To'lov qayd etiladi
      └─ Qarz qoldig'i yangilanadi
         └─ Ledger'ga "payment" yozuvi
```

## Backend Database Strukturasi

### client_debts Table
```sql
CREATE TABLE client_debts (
  debt_id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  invoice_id INTEGER,  -- NULL bo'lishi mumkin (manual qarz)
  amount DECIMAL(15,2) NOT NULL,
  outstanding DECIMAL(15,2) NOT NULL,
  due_date DATE,
  overdue BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### debt_history Table
```sql
CREATE TABLE debt_history (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  debt_id INTEGER,
  type VARCHAR(20) NOT NULL,  -- 'sale', 'payment', 'writeoff'
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  note TEXT,
  operator_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Frontend Komponentlar

1. **DebtList.jsx** - Qarz ro'yxati
2. **DebtLedger.jsx** - Mijoz ledger'i
3. **RecordPaymentModal.jsx** - To'lov qayd etish
4. **CreateDebtModal.jsx** - Yangi qarz qo'shish (yangi)

## Backend API Endpoints

### Qarz Ro'yxati
```
GET /api/debt?page=1&limit=20&filter=overdue&search=Ali
```

### Qarz Ledger
```
GET /api/debt/:client_id/ledger?from=2025-11-01&to=2025-11-15&type=payment
```

### To'lov Qayd Etish
```
POST /api/debt/:client_id/payment
Body: { amount, method, note }
```

### Qarz Yaratish (Manual)
```
POST /api/debt/create
Body: { client_id, amount, due_date, note }
```

## Xulosa

- **Qarz odatda sotuv jarayonida avtomatik yaratiladi**
- **Qo'lda qarz qo'shish ham mumkin** (yangi funksiya)
- **To'lov qayd etish orqali qarz kamayadi**
- **Ledger barcha operatsiyalarni ko'rsatadi**

