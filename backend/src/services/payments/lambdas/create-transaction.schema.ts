import { z } from "zod/v3";

export const CreateTransactionSchema = z
  .object({
    amount: z.number().positive(),
    invoiceId: z.string().min(5),
  })
  .describe("Schema for creating a new transaction");

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
