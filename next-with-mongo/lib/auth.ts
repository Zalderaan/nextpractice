// lib/auth.ts
import { cookies, headers } from "next/headers";
import { decodeJwt } from "jose";
import { redirect } from "next/navigation";

export async function getAuthContext() {
  const cookieStore = await cookies();
  const headersList = await headers();

  let token = headersList.get("Authorization")?.split(" ")[1];
  if (!token) token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  const { sub: userId } = decodeJwt(token);
  if (!userId) redirect("/login");

  return { token, userId };
}
