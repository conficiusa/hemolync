import { z } from "zod";

export const UserInviteSchema = z.object({
	password: z.string().min(1, "Password is required"),
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	role: z.string().min(1, "User role is required"),
	email: z
		.string()
		.min(1, "Email address is required")
		.email("Invalid email address"),
});
