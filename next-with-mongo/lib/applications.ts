/**
 *  shared util between /board and /applications
 * lib/applications.ts
 **/

import { cacheTag, cacheLife } from "next/cache";

const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;
export async function getApplications(userId: string, token: string) {
  "use cache";
  cacheTag("applications", `applications-${userId}`);
  cacheLife("minutes"); // stale: 5min, revalidate: 1min

  const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Attach token here
    },
  });

  if (!res.ok) {
    console.error(
      "Error fetching applications! MORE LOGGING ERRORS NEEDED HERE",
    );
  }
  return res.json();
}

// const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`, {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, // Attach token here
//   },
//   next: { tags: ["applications"] }, // smart caching
// });

// if (!res.ok) {
//   console.error("Error fetching applications! MORE LOGGING ERRORS NEEDED HERE");
// }

// const data = await res.json();
