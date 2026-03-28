"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from 'zod';
import { fullFormSchema } from "./_components/AddApplicationDialog";
// Optional: Import your Zod schema here to re-validate on the server for ultimate security,
// though your backend probably already validates it too.

export async function createApplicationAction(data: z.infer<typeof fullFormSchema>) {
  // Type this with your Zod infer
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_URL}/applications`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      // Handle backend-specific errors (e.g., 400 Bad Request from Express)
      return {
        success: false,
        error: "Failed to create application on backend",
      };
    }

    // Force the page to re-fetch the latest data from the backend
    revalidatePath("/dashboard/applications");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}
