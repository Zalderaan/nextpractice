"use server";

import { updateTag } from "next/cache";
import * as z from "zod";
import { fullFormSchema } from "./_components/AddApplicationDialog";
import { getAuthContext } from "@/lib/auth";
// Optional: Import your Zod schema here to re-validate on the server for ultimate security,
// though your backend probably already validates it too.

export async function createApplicationAction(
  data: z.infer<typeof fullFormSchema>,
) {
  const { token, userId } = await getAuthContext(); // ← gets both

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
    updateTag(`applications-${userId}`);
    // revalidatePath('/dashboard/board');

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
  const { token, userId } = await getAuthContext(); // ← gets both

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

    updateTag(`applications-${userId}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}

export async function updateApplicationAction(
  appId: string,
  data: z.infer<typeof fullFormSchema>,
) {
  const { token, userId } = await getAuthContext(); // ← gets both

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

    updateTag(`applications-${userId}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}

export async function deleteApplicationAction(appId: string) {
  const { token, userId } = await getAuthContext(); // ← gets both

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
    updateTag(`applications-${userId}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Network error occurred" };
  }
}
