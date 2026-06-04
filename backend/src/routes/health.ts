import { Elysia, t } from "elysia";
import { jwtAuthPlugin } from "../plugins/jwt-auth";
import {
  createKidneyLabRecord,
  deleteKidneyLabRecord,
  getKidneyLabRecordById,
  isDuplicateLabNoError,
  listKidneyLabRecords,
  toKidneyLabResponse,
  validateCreateKidneyLabInput,
} from "../services/kidney-lab";

const bloodTestBodySchema = t.Optional(
  t.Object({
    creatinine: t.Optional(t.Number({ minimum: 0 })),
    egfr: t.Optional(t.Number({ minimum: 0 })),
  }),
);

const urineTestBodySchema = t.Optional(
  t.Object({
    protein: t.Optional(t.String({ minLength: 1 })),
    blood: t.Optional(t.String({ minLength: 1 })),
    bacteria: t.Optional(t.String({ minLength: 1 })),
  }),
);

const createKidneyLabBodySchema = t.Object({
  hn: t.String({ minLength: 1, maxLength: 32 }),
  lab_no: t.String({ minLength: 1, maxLength: 64 }),
  test_date: t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
  blood_test: bloodTestBodySchema,
  urine_test: urineTestBodySchema,
});

export const healthRoutes = new Elysia({ prefix: "/health" })
  .use(jwtAuthPlugin)
  .post(
    "/kidney-labs",
    async ({ body, userId, set }) => {
      const validationError = validateCreateKidneyLabInput(body);

      if (validationError) {
        set.status = 400;
        return {
          success: false,
          message: validationError,
        };
      }

      try {
        const record = await createKidneyLabRecord(userId, body);

        set.status = 201;
        return {
          success: true,
          data: toKidneyLabResponse(record),
        };
      } catch (error: unknown) {
        if (isDuplicateLabNoError(error)) {
          set.status = 409;
          return {
            success: false,
            message: "lab_no นี้มีอยู่แล้วสำหรับบัญชีของคุณ",
          };
        }

        console.error("createKidneyLabRecord failed:", error);
        set.status = 500;
        return {
          success: false,
          message: "Failed to save lab record",
        };
      }
    },
    {
      body: createKidneyLabBodySchema,
    },
  )
  .get("/kidney-labs", async ({ userId }) => {
    const records = await listKidneyLabRecords(userId);

    return {
      success: true,
      data: records.map(toKidneyLabResponse),
    };
  })
  .get(
    "/kidney-labs/:id",
    async ({ params, userId, set }) => {
      const id = Number(params.id);

      if (!Number.isFinite(id)) {
        set.status = 400;
        return {
          success: false,
          message: "Invalid id",
        };
      }

      const record = await getKidneyLabRecordById(userId, id);

      if (!record) {
        set.status = 404;
        return {
          success: false,
          message: "Lab record not found",
        };
      }

      return {
        success: true,
        data: toKidneyLabResponse(record),
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .delete(
    "/kidney-labs/:id",
    async ({ params, userId, set }) => {
      const id = Number(params.id);

      if (!Number.isFinite(id)) {
        set.status = 400;
        return {
          success: false,
          message: "Invalid id",
        };
      }

      const deleted = await deleteKidneyLabRecord(userId, id);

      if (!deleted) {
        set.status = 404;
        return {
          success: false,
          message: "Lab record not found",
        };
      }

      return {
        success: true,
        message: "Deleted",
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
