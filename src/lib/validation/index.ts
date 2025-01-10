import * as z from "zod"

export const SignupValidation = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

export const SigninValidation = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const AddResourceValidation = z.object({
  id: z.string(),
})

export const FeedbackValidation = z.object({
  issueType: z.string().min(1, { message: "Issue type is required" }),
  description: z.string().min(1, { message: "Description is required" }),
})
