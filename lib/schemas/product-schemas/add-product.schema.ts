import { z } from "zod";

export const UserInviteSchema = z.object({
	batch_number: z.string().min(1, "Batch number is required"),
});
