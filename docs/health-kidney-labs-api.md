# Health — Kidney Lab API

Base URL: `http://localhost:3001` (หรือค่า `API_URL`)

ทุก endpoint ต้องส่ง header:

```
Authorization: Bearer <JWT จาก POST /auth/login>
Content-Type: application/json   (เฉพาะ POST)
```

---

## POST `/health/kidney-labs`

บันทึกผลตรวจ (เลือดอย่างเดียว / ปัสสาวะอย่างเดียว / ครบ)

### Request body

| Field | Type | Required | หมายเหตุ |
|-------|------|----------|----------|
| `hn` | string | ✅ | สูงสุด 32 ตัวอักษร |
| `lab_no` | string | ✅ | สูงสุด 64, unique ต่อ user |
| `test_date` | string | ✅ | `YYYY-MM-DD` |
| `blood_test` | object | ❌ | อย่างน้อยต้องมี `blood_test` หรือ `urine_test` |
| `blood_test.creatinine` | number | ❌ | ≥ 0 |
| `blood_test.egfr` | number | ❌ | ≥ 0 |
| `urine_test` | object | ❌ | |
| `urine_test.protein` | string | ❌ | เช่น `Negative` |
| `urine_test.blood` | string | ❌ | เช่น `2+` |
| `urine_test.bacteria` | string | ❌ | เช่น `1+` |

### ตัวอย่าง — เลือดอย่างเดียว

```json
{
  "hn": "55221551",
  "lab_no": "OR26042701126",
  "test_date": "2026-03-02",
  "blood_test": {
    "creatinine": 0.75,
    "egfr": 126.6
  }
}
```

### ตัวอย่าง — ปัสสาวะอย่างเดียว

```json
{
  "hn": "55221551",
  "lab_no": "OR26042701168",
  "test_date": "2026-03-02",
  "urine_test": {
    "protein": "Negative",
    "blood": "2+",
    "bacteria": "1+"
  }
}
```

### Response `201`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "hn": "55221551",
    "lab_no": "OR26042701126",
    "test_date": "2026-03-02",
    "has_blood": true,
    "has_urine": false,
    "has_abnormal": false,
    "blood_test": { "creatinine": 0.75, "egfr": 126.6 },
    "urine_test": null,
    "created_at": "2026-03-02T10:00:00.000Z"
  }
}
```

### Errors

| Status | message |
|--------|---------|
| 400 | validation (เช่น ไม่มีเลือด/ปัสสาวะ) |
| 401 | Unauthorized |
| 409 | lab_no ซ้ำ |
| 500 | Failed to save lab record |

---

## GET `/health/kidney-labs`

ดึงรายการทั้งหมดของ user (เรียง `test_date` ใหม่สุดก่อน)

### Response `200`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "hn": "55221551",
      "lab_no": "OR26042701126",
      "test_date": "2026-03-02",
      "has_blood": true,
      "has_urine": false,
      "has_abnormal": false,
      "blood_test": { "creatinine": 0.75, "egfr": 126.6 },
      "urine_test": null,
      "created_at": "2026-03-02T10:00:00.000Z"
    }
  ]
}
```

---

## GET `/health/kidney-labs/:id`

ดึง 1 รายการ (เฉพาะของ user ที่ล็อกอิน)

### Params

| Name | Type |
|------|------|
| `id` | number (path) |

### Response `200`

```json
{
  "success": true,
  "data": { "...KidneyLabRecord..." }
}
```

### Errors

| Status | message |
|--------|---------|
| 400 | Invalid id |
| 401 | Unauthorized |
| 404 | Lab record not found |

---

## DELETE `/health/kidney-labs/:id`

ลบรายการ

### Response `200`

```json
{
  "success": true,
  "message": "Deleted"
}
```

### Errors

| Status | message |
|--------|---------|
| 400 | Invalid id |
| 401 | Unauthorized |
| 404 | Lab record not found |

---

## TypeScript (frontend)

| ไฟล์ | ใช้ทำอะไร |
|------|-----------|
| `frontend/src/types/kidney-lab.ts` | types ทั้งหมด |
| `frontend/src/lib/api/kidney-lab.ts` | `createKidneyLab`, `listKidneyLabs`, `getKidneyLab`, `deleteKidneyLab` |
| `frontend/src/schemas/kidney-lab.ts` | Zod สำหรับฟอร์ม create |

## TypeScript (backend)

| ไฟล์ | ใช้ทำอะไร |
|------|-----------|
| `backend/src/types/kidney-lab.ts` | types + response aliases |
