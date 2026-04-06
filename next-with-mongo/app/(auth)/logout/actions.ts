"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();
  const headersList = await headers();

  let token = headersList.get("Authorization")?.split(" ")[1];
  if (!token) token = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_URL}/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message || `Failed to delete application (${res.status})`,
      };
    }

    // delete cookies from response
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}
