import { z } from "zod/v3";

export const CreateOrderSchema = z
  .object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
    notes: z.string().optional(),
  })
  .describe("Schema for creating a new order");

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
