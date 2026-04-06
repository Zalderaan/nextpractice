import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) {
      token = cookieStore.get("accessToken")?.value;
    }

    // 1. Call the backend logout endpoint (optional but recommended)
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_URL}/logout`,
      {
        method: "POST",
        credentials: "include", // Send cookies to backend
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

	console.log("This is backendResponse in logout route.ts: ", backendResponse)

    if (!backendResponse.ok) {
      throw new Error("Backend logout failed");
    }

    // 2. Clear cookies on the frontend
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 },
    );
  }
}
