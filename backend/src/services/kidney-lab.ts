import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { kidneyLabRecords, type KidneyLabRecord } from "../db/schema";
import type {
  CreateKidneyLabInput,
  KidneyLabRecordResponse,
} from "../types/kidney-lab";

function parseNumeric(value: string | null): number | null {
  if (value === null) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatTestDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

export function hasBloodValues(
  creatinine: number | null | undefined,
  egfr: number | null | undefined,
): boolean {
  return creatinine !== undefined || egfr !== undefined;
}

export function hasUrineValues(
  protein: string | null | undefined,
  blood: string | null | undefined,
  bacteria: string | null | undefined,
): boolean {
  return (
    protein !== undefined ||
    blood !== undefined ||
    bacteria !== undefined
  );
}

export function validateCreateKidneyLabInput(
  input: CreateKidneyLabInput,
): string | null {
  const blood = input.blood_test;
  const urine = input.urine_test;

  const hasBlood = blood
    ? hasBloodValues(blood.creatinine, blood.egfr)
    : false;
  const hasUrine = urine
    ? hasUrineValues(urine.protein, urine.blood, urine.bacteria)
    : false;

  if (!hasBlood && !hasUrine) {
    return "ต้องมีผลเลือดหรือผลปัสสาวะอย่างน้อยหนึ่งชุด";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.test_date)) {
    return "test_date ต้องเป็นรูปแบบ YYYY-MM-DD";
  }

  return null;
}

function computeHasAbnormal(record: KidneyLabRecord): boolean {
  if (record.urineBlood && record.urineBlood !== "Negative") {
    return true;
  }

  if (
    record.urineBacteria &&
    record.urineBacteria !== "Negative" &&
    record.urineBacteria !== "Not Found"
  ) {
    return true;
  }

  return false;
}

export function toKidneyLabResponse(
  record: KidneyLabRecord,
): KidneyLabRecordResponse {
  const creatinine = parseNumeric(record.creatinine);
  const egfr = parseNumeric(record.egfr);
  const hasBlood = creatinine !== null || egfr !== null;
  const hasUrine =
    record.urineProtein !== null ||
    record.urineBlood !== null ||
    record.urineBacteria !== null;

  return {
    id: record.id,
    hn: record.hn,
    lab_no: record.labNo,
    test_date: formatTestDate(record.testDate),
    has_blood: hasBlood,
    has_urine: hasUrine,
    has_abnormal: computeHasAbnormal(record),
    blood_test: hasBlood
      ? {
          creatinine,
          egfr,
        }
      : null,
    urine_test: hasUrine
      ? {
          protein: record.urineProtein,
          blood: record.urineBlood,
          bacteria: record.urineBacteria,
        }
      : null,
    created_at: record.createdAt.toISOString(),
  };
}

export async function createKidneyLabRecord(
  userId: number,
  input: CreateKidneyLabInput,
): Promise<KidneyLabRecord> {
  const blood = input.blood_test;
  const urine = input.urine_test;

  const [record] = await db
    .insert(kidneyLabRecords)
    .values({
      userId,
      hn: input.hn.trim(),
      labNo: input.lab_no.trim(),
      testDate: input.test_date,
      creatinine:
        blood?.creatinine !== undefined
          ? String(blood.creatinine)
          : null,
      egfr: blood?.egfr !== undefined ? String(blood.egfr) : null,
      urineProtein: urine?.protein?.trim() ?? null,
      urineBlood: urine?.blood?.trim() ?? null,
      urineBacteria: urine?.bacteria?.trim() ?? null,
    })
    .returning();

  if (!record) {
    throw new Error("Failed to create kidney lab record");
  }

  return record;
}

export async function listKidneyLabRecords(
  userId: number,
): Promise<KidneyLabRecord[]> {
  return db
    .select()
    .from(kidneyLabRecords)
    .where(eq(kidneyLabRecords.userId, userId))
    .orderBy(desc(kidneyLabRecords.testDate), desc(kidneyLabRecords.id));
}

export async function getKidneyLabRecordById(
  userId: number,
  id: number,
): Promise<KidneyLabRecord | null> {
  const [record] = await db
    .select()
    .from(kidneyLabRecords)
    .where(
      and(eq(kidneyLabRecords.id, id), eq(kidneyLabRecords.userId, userId)),
    )
    .limit(1);

  return record ?? null;
}

export async function deleteKidneyLabRecord(
  userId: number,
  id: number,
): Promise<boolean> {
  const deleted = await db
    .delete(kidneyLabRecords)
    .where(
      and(eq(kidneyLabRecords.id, id), eq(kidneyLabRecords.userId, userId)),
    )
    .returning({ id: kidneyLabRecords.id });

  return deleted.length > 0;
}

export function isDuplicateLabNoError(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  ) {
    return true;
  }

  return (
    error instanceof Error &&
    error.message.includes("kidney_lab_records_user_lab_unique")
  );
}
