# Qarz (Debt) Bo'limi - Qanday Ishlaydi?

## Hozirgi Holat

Hozirgi implementatsiyada Qarz bo'limi quyidagilarni ko'rsatadi va bajaradi:

### 1. **Qarz Ro'yxati (DebtList)**

- Barcha mijozlarning qarz qoldiqlarini ko'rsatadi
- Filtrlar: Muddat o'tgan, Faol, To'langan
- Qidiruv: Mijoz nomi yoki telefon bo'yicha

### 2. **Qarz Ledger (DebtLedger)**

- Mijozning to'liq qarz tarixini ko'rsatadi
- Har bir operatsiya: Sotuv, To'lov, Yozib olish
- Sana va tur bo'yicha filtrlash

### 3. **To'lov Qayd Etish (RecordPaymentModal)**

- Mijoz to'lovini qayd etish
- Summa validatsiyasi
- Optimistic UI yangilanish

## Qarz Qanday Yaratiladi?

### Variant 1: Sotuv Jarayonida Avtomatik (Tavsiya etiladi)

Qarz odatda **sotuv (sale/invoice) jarayonida** avtomatik yaratiladi:

1. **Mijoz mahsulot sotib oladi**
2. **To'lov to'liq emas** (qisman to'lov yoki umuman to'lanmagan)
3. **Backend avtomatik qarz yaratadi:**
   ```sql
   -- Invoice yaratilganda
   INSERT INTO client_debts (
     client_id,
     invoice_id,
     amount,
     outstanding,
     due_date,
     created_at
   ) VALUES (
     client_id,
     invoice_id,
     total_amount - paid_amount,
     total_amount - paid_amount,
     due_date,
     NOW()
   )
   ```

### Variant 2: Manual Qarz Qo'shish

Agar qo'lda qarz qo'shish kerak bo'lsa, quyidagi funksiya qo'shilishi kerak.

## Backend API Endpoints

### Qarz Yaratish (Invoice'dan)

```
POST /api/invoices
Body: {
  client_id: "c1",
  items: [...],
  payment_method: "credit",  // yoki "partial"
  paid_amount: 50000,        // to'langan summa
  total_amount: 200000       // jami summa
}

Response: {
  invoice_id: "INV-1001",
  debt_created: true,
  debt_id: "d1",
  outstanding: 150000
}
```

### Qarz Yaratish (Manual)

```
POST /api/debt/create
Body: {
  client_id: "c1",
  amount: 200000,
  due_date: "2025-12-15",
  note: "Qo'lda qarz qo'shildi",
  invoice_id: null  // agar invoice bo'lmasa
}
```

### Qarz Ro'yxati

```
GET /api/debt?page=1&limit=20&filter=overdue
```

### Qarz Ledger

```
GET /api/debt/:client_id/ledger?from=2025-11-01&to=2025-11-15
```

### To'lov Qayd Etish

```
POST /api/debt/:client_id/payment
Body: {
  amount: 50000,
  method: "cash",
  note: "Naqd to'lov"
}
```

## Ma'lumotlar Strukturasi

### Client Debts Table

```sql
CREATE TABLE client_debts (
  debt_id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  invoice_id INTEGER,  -- NULL bo'lishi mumkin (manual qarz)
  amount DECIMAL(15,2) NOT NULL,  -- jami qarz
  outstanding DECIMAL(15,2) NOT NULL,  -- qarz qoldig'i
  due_date DATE,
  overdue BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Debt History/Ledger Table

```sql
CREATE TABLE debt_history (
  id SERIAL PRIMARY KEY,
  debt_id INTEGER,
  client_id INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,  -- 'sale', 'payment', 'writeoff'
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  note TEXT,
  operator_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Workflow Diagram

```
1. SOTUV JARAYONI
   ├─ Mijoz mahsulot sotib oladi
   ├─ To'lov to'liq emas?
   │  ├─ Ha → Qarz yaratiladi (avtomatik)
   │  └─ Yo'q → Qarz yaratilmaydi
   │
2. QARZ BO'LIMI
   ├─ Qarz ro'yxatini ko'rish
   ├─ Mijoz ledger'ini ko'rish
   └─ To'lov qayd etish

3. TO'LOV QAYD ETISH
   ├─ Summa kiritiladi
   ├─ Backend qarz qoldig'ini yangilaydi
   └─ Ledger'ga yozuv qo'shiladi
```

## Frontend Integration

Qarz yaratish odatda **sotuv sahifasida** amalga oshiriladi, lekin agar kerak bo'lsa, Qarz bo'limiga "Yangi qarz qo'shish" tugmasi qo'shilishi mumkin.
