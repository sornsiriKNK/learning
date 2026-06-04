import { z } from "zod";
import type { CreateKidneyLabRequest } from "@/types/kidney-lab";

const emptyToUndefined = (value: unknown): unknown => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  return value;
};

const optionalNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0).optional(),
);

const optionalUrineString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().min(1).optional(),
);

const bloodTestFormSchema = z.object({
  creatinine: optionalNumber,
  egfr: optionalNumber,
});

const urineTestFormSchema = z.object({
  protein: optionalUrineString,
  blood: optionalUrineString,
  bacteria: optionalUrineString,
});

function refineHasBloodOrUrine(
  data: {
    blood_test?: { creatinine?: number; egfr?: number };
    urine_test?: { protein?: string; blood?: string; bacteria?: string };
  },
  ctx: z.RefinementCtx,
): void {
  const blood = data.blood_test;
  const urine = data.urine_test;

  const hasBlood =
    blood?.creatinine !== undefined || blood?.egfr !== undefined;
  const hasUrine =
    urine?.protein !== undefined ||
    urine?.blood !== undefined ||
    urine?.bacteria !== undefined;

  if (!hasBlood && !hasUrine) {
    ctx.addIssue({
      code: "custom",
      message: "ต้องมีผลเลือดหรือผลปัสสาวะอย่างน้อยหนึ่งชุด",
      path: ["blood_test"],
    });
  }
}

/** สำหรับ react-hook-form + zodResolver */
export const createKidneyLabFormSchema = z
  .object({
    hn: z.string().min(1, "กรอก HN").max(32),
    lab_no: z.string().min(1, "กรอกเลข Lab").max(64),
    test_date: z.string().min(1, "กรอกวันที่ตรวจ").regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "รูปแบบ YYYY-MM-DD",
    ),
    blood_test: bloodTestFormSchema,
    urine_test: urineTestFormSchema,
  })
  .superRefine(refineHasBloodOrUrine);

export type CreateKidneyLabFormValues = z.infer<typeof createKidneyLabFormSchema>;

export const createKidneyLabDefaultValues: CreateKidneyLabFormValues = {
  hn: "",
  lab_no: "",
  test_date: "",
  blood_test: {
    creatinine: undefined,
    egfr: undefined,
  },
  urine_test: {
    protein: undefined,
    blood: undefined,
    bacteria: undefined,
  },
};

/** แปลงค่าหลัง validate เป็น body ส่ง API */
export function formValuesToApiBody(
  values: CreateKidneyLabFormValues,
): CreateKidneyLabRequest {
  const body: CreateKidneyLabRequest = {
    hn: values.hn.trim(),
    lab_no: values.lab_no.trim(),
    test_date: values.test_date,
  };

  const { creatinine, egfr } = values.blood_test;
  if (creatinine !== undefined || egfr !== undefined) {
    body.blood_test = {
      ...(creatinine !== undefined && { creatinine }),
      ...(egfr !== undefined && { egfr }),
    };
  }

  const { protein, blood, bacteria } = values.urine_test;
  if (protein !== undefined || blood !== undefined || bacteria !== undefined) {
    body.urine_test = {
      ...(protein !== undefined && { protein }),
      ...(blood !== undefined && { blood }),
      ...(bacteria !== undefined && { bacteria }),
    };
  }

  return body;
}

/** @deprecated ใช้ createKidneyLabFormSchema แทน */
export const createKidneyLabSchema = createKidneyLabFormSchema;
