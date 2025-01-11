import { z } from "zod";

export const pathIdSchema = z.number().int().min(1);
