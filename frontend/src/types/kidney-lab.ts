/** Request / response types for `/health/kidney-labs` API */

export type KidneyLabBloodTestInput = {
  creatinine?: number;
  egfr?: number;
};

export type KidneyLabUrineTestInput = {
  protein?: string;
  blood?: string;
  bacteria?: string;
};

/** POST /health/kidney-labs */
export type CreateKidneyLabRequest = {
  hn: string;
  lab_no: string;
  test_date: string;
  blood_test?: KidneyLabBloodTestInput;
  urine_test?: KidneyLabUrineTestInput;
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

/** Single record in GET list / GET :id / POST response */
export type KidneyLabRecord = {
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

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ApiMessageResponse = {
  success: true;
  message: string;
};

/** POST /health/kidney-labs — 201 */
export type CreateKidneyLabResponse = ApiSuccessResponse<KidneyLabRecord>;

/** GET /health/kidney-labs — 200 */
export type ListKidneyLabsResponse = ApiSuccessResponse<KidneyLabRecord[]>;

/** GET /health/kidney-labs/:id — 200 */
export type GetKidneyLabResponse = ApiSuccessResponse<KidneyLabRecord>;

/** DELETE /health/kidney-labs/:id — 200 */
export type DeleteKidneyLabResponse = ApiMessageResponse;

export type KidneyLabApiResponse =
  | CreateKidneyLabResponse
  | ListKidneyLabsResponse
  | GetKidneyLabResponse
  | DeleteKidneyLabResponse
  | ApiErrorResponse;
