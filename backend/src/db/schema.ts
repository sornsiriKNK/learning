import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const kidneyLabRecords = pgTable(
  "kidney_lab_records",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hn: varchar("hn", { length: 32 }).notNull(),
    labNo: varchar("lab_no", { length: 64 }).notNull(),
    testDate: date("test_date").notNull(),
    creatinine: numeric("creatinine", { precision: 6, scale: 3 }),
    egfr: numeric("egfr", { precision: 8, scale: 2 }),
    urineProtein: varchar("urine_protein", { length: 32 }),
    urineBlood: varchar("urine_blood", { length: 16 }),
    urineBacteria: varchar("urine_bacteria", { length: 16 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("kidney_lab_records_user_lab_unique").on(
      table.userId,
      table.labNo,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type KidneyLabRecord = typeof kidneyLabRecords.$inferSelect;
export type NewKidneyLabRecord = typeof kidneyLabRecords.$inferInsert;
