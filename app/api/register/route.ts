import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth-schema";
import { createUser } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Data pendaftaran tidak valid.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hash(parsed.data.password, 10);

    await createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    });

    return NextResponse.json({
      message: "Akun berhasil dibuat.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          message: "Email sudah terdaftar. Silakan login.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "Gagal membuat akun.",
      },
      { status: 500 },
    );
  }
}
