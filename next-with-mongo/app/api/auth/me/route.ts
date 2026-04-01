import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();

    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) token = cookieStore.get("accessToken")?.value;

    const backendRes = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await backendRes.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Me request failed" },
      { status: 500 },
    );
  }
}
