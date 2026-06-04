export type BloodTestInput = {
  creatinine?: number;
  egfr?: number;
};

export type UrineTestInput = {
  protein?: string;
  blood?: string;
  bacteria?: string;
};

export type CreateKidneyLabInput = {
  hn: string;
  lab_no: string;
  test_date: string;
  blood_test?: BloodTestInput;
  urine_test?: UrineTestInput;
};

export type KidneyLabBloodTest = {
  creatinine: number | null;
  egfr: number | null;
};

export type KidneyLabUrineTest = {
  protein: string | null;
  blood: string | null;
  bacteria: string | null;
};

export type KidneyLabRecordResponse = {
  id: number;
  hn: string;
  lab_no: string;
  test_date: string;
  has_blood: boolean;
  has_urine: boolean;
  has_abnormal: boolean;
  blood_test: KidneyLabBloodTest | null;
  urine_test: KidneyLabUrineTest | null;
  created_at: string;
};
