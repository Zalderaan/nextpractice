"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { fullFormSchema } from "./_components/AddApplicationDialog";
// Optional: Import your Zod schema here to re-validate on the server for ultimate security,
// though your backend probably already validates it too.

export async function createApplicationAction(
  data: z.infer<typeof fullFormSchema>,
) {
  const cookieStore = await cookies();
  const headersList = await headers();

  let token = headersList.get("Authorization")?.split(" ")[1];
  if (!token) token = cookieStore.get("accessToken")?.value;

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

export async function updateApplicationStatusAction(
  appId: string,
  data: {
    newOrder: number;
    newStatus: string;
  },
) {
  const cookieStore = await cookies();
  const headersList = await headers();

  let token = headersList.get("Authorization")?.split(" ")[1];
  if (!token) token = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_URL}/applications/${appId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Failed to update application ${res.status}`,
        details: errorData.details || "No details provided",
      };
    }

    revalidatePath("/dashboard/board");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}

export async function updateApplicationAction(
  appId: string,
  data: z.infer<typeof fullFormSchema>,
) {
  const cookieStore = await cookies();
  const headersList = await headers();

  let token = headersList.get("Authorization")?.split(" ")[1];
  if (!token) token = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_URL}/applications/${appId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message || `Failed to update application (${res.status})`,
      };
    }

    revalidatePath("/dashboard/board");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}

export async function deleteApplicationAction(appId: string) {
  const cookieStore = await cookies();
  const headersList = await headers();
  let token = headersList.get("Authorization")?.split(" ")[1];
  if (!token) token = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_URL}/applications/${appId}`,
      {
        method: "DELETE",
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

    //Force the page to re-fetch the latest data from the backend
    revalidatePath("/dashboard/board");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}
