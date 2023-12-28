import z from "zod";

export const SignupData = z
  .object({
    email: z
      .string({ required_error: "Please enter your email" })
      .email("Email is incorrect"),
    username: z.string({ required_error: "Please enter your username" }),
    password: z
      .string({ required_error: "Please enter your password" })
      .min(8, "Password has to be at least eight characters long"),
    passwordRepeated: z.string({
      required_error: "Please repeat your password"
    })
  })
  .refine(({ password, passwordRepeated }) => password === passwordRepeated, {
    message: "Passwords haave to be the same."
  })
  .transform(({ password, email, username }) => ({
    password,
    email,
    username
  }));

export type SignupDataInput = z.input<typeof SignupData>;
export type SignupDataType = z.output<typeof SignupData>;

export const LoginData = z.object({
  email: z
    .string({ required_error: "Please enter your email" })
    .email("Email is incorrect"),
  password: z
    .string({ required_error: "Please enter your password" })
    .min(8, "Password has to be at least eight characters long")
});

export type LoginDataType = z.infer<typeof LoginData>;

// PATCH /user/changePassword
export const PatchUserChangePasswordDto = z.object({
  password: z.string().min(1),
  newPassword: z.string().min(1)
});
export type PatchUserChangePassword = z.infer<
  typeof PatchUserChangePasswordDto
>;
export type PatchUserChangePasswordKeys = keyof PatchUserChangePassword;

// PATCH /user/changeUsername
export const PatchUserChangeUsernameDto = z.object({
  username: z.string().min(3)
});
export type PatchUserChangeUsername = z.infer<
  typeof PatchUserChangeUsernameDto
>;
export type PatchUserChangeUsernameKeys = keyof PatchUserChangePassword;

// PATCH /user/changeEmail
export const PatchUserChangeEmailDto = z.object({
  email: z.string().email()
});
export type PatchUserChangeEmail = z.infer<typeof PatchUserChangeEmailDto>;
export type PatchUserChangeEmailKeys = keyof PatchUserChangePassword;

export enum UserRole {
  ADMIN = "admin",
  DEFAULT = "default"
}

export const UserDto = z
  .object({
    email: z.string().email(),
    username: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    role: z.enum([UserRole.ADMIN, UserRole.DEFAULT]),
    _id: z.string()
  })
  .transform(({ createdAt, updatedAt, ...rest }) => ({
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    ...rest
  }));

export type User = z.output<typeof UserDto>;
