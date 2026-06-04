import type { CreateKidneyLabRequest } from "@/types/kidney-lab";

export type CreateHealthFormValues = {
  hn: string;
  lab_no: string;
  test_date: string;
  creatinine: number;
  egfr: number;
  protein: string;
  blood: number;
  bacteria: number;
};

export function mapCreateHealthFormToApi(
  data: CreateHealthFormValues,
): CreateKidneyLabRequest {
  const body: CreateKidneyLabRequest = {
    hn: data.hn.trim(),
    lab_no: data.lab_no.trim(),
    test_date: data.test_date,
  };

  const bloodTest: CreateKidneyLabRequest["blood_test"] = {};
  if (!Number.isNaN(data.creatinine)) {
    bloodTest.creatinine = data.creatinine;
  }
  if (!Number.isNaN(data.egfr)) {
    bloodTest.egfr = data.egfr;
  }
  if (Object.keys(bloodTest).length > 0) {
    body.blood_test = bloodTest;
  }

  const urineTest: CreateKidneyLabRequest["urine_test"] = {};
  const protein = data.protein.trim();
  if (protein) {
    urineTest.protein = protein;
  }
  if (!Number.isNaN(data.blood)) {
    urineTest.blood = String(data.blood);
  }
  if (!Number.isNaN(data.bacteria)) {
    urineTest.bacteria = String(data.bacteria);
  }
  if (Object.keys(urineTest).length > 0) {
    body.urine_test = urineTest;
  }

  return body;
}
