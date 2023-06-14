import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import prismadb from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Incomplete form", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(`An error ocurred in registration`, { error });
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  } finally {
    await prismadb.$disconnect();
  }
}
