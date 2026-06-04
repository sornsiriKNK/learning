CREATE TABLE IF NOT EXISTS "kidney_lab_records" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "hn" varchar(32) NOT NULL,
  "lab_no" varchar(64) NOT NULL,
  "test_date" date NOT NULL,
  "creatinine" numeric(6, 3),
  "egfr" numeric(8, 2),
  "urine_protein" varchar(32),
  "urine_blood" varchar(16),
  "urine_bacteria" varchar(16),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "kidney_lab_records_user_lab_unique"
  ON "kidney_lab_records" ("user_id", "lab_no");

CREATE INDEX IF NOT EXISTS "kidney_lab_records_user_test_date_idx"
  ON "kidney_lab_records" ("user_id", "test_date" DESC);
