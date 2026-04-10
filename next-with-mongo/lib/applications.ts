import { cache } from "react";
import { cookies, headers } from "next/headers";

const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;

// React cache() deduplicates calls within the same request.
// fetch() with next.tags handles cross-request caching.
export const getApplications = cache(async (userId: string, token: string) => {
  const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: [`applications-${userId}`], // per-user cache tag
      revalidate: 60, // revalidate every 60s
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch applications: ${res.status}`);
  }

  return res.json();
});
