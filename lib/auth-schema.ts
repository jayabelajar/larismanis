import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.email("Masukkan email yang valid.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .regex(/[a-zA-Z]/, "Password harus mengandung huruf.")
    .regex(/[0-9]/, "Password harus mengandung angka."),
});

export const loginSchema = z.object({
  email: z.email("Masukkan email yang valid.").trim().toLowerCase(),
  password: z.string().min(1, "Password wajib diisi."),
});
