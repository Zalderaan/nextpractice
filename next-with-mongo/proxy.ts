import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const protectedPrefixes = ["/dashboard"];
const guestOnly = ["/login", "/signup"];

export async function proxy(req: NextRequest) {
  // 1. Intercept and extract
  const path = req.nextUrl.pathname;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
  const isGuestOnly = guestOnly.some((p) => path.startsWith(p));

  // 2 & 3. Guest-Only Route Check
  if (isGuestOnly && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 4. Protected Route Check
  if (isProtected) {
    let isAccessTokenValid = false;

    if (accessToken) {
      try {
        const decoded = decodeJwt(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        // Buffer of 10 seconds to prevent edge-case expiration during transit
        if (decoded.exp && decoded.exp > currentTime + 10) {
          isAccessTokenValid = true;
        }
      } catch (error) {
        // Token is malformed
        isAccessTokenValid = false;
      }
    }

    // 5. Valid Access Token
    if (isAccessTokenValid) {
      return NextResponse.next();
    }

    // 6 & 7. Expired/Missing Access Token, No Refresh Token
    if (!refreshToken) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    // 8. Refresh Token Exists -> Call Backend
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        },
      );

      // 9. Refresh API returns Error
      if (!refreshRes.ok) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      // 10. Refresh API Succeeds
      const data = await refreshRes.json();
      const newAccessToken = data.accessToken;
      // Note: adjust 'data.accessToken' based on your actual backend JSON structure

      // 11 & 13. Create response and inject new token into SSR request headers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // 12. Update Browser Cookies
      response.cookies.set({
        name: "accessToken",
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 15, // Set to match your backend's access token lifespan (e.g., 15 mins)
      });

      // 14. Return modified response
      return response;
    } catch (error) {
      // Network error during fetch
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
