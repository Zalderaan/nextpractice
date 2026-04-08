import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const protectedPrefixes = ["/dashboard"];
const guestOnly = ["/login", "/signup"];

export async function proxy(req: NextRequest) {
  // 1. Intercept and extract path and cookies
  const path = req.nextUrl.pathname;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
  const isGuestOnly = guestOnly.some((p) => path.startsWith(p));

  // 2. Guest-Only Route Check (e.g., redirect logged-in users away from /login)
  if (isGuestOnly && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Protected Route Logic
  if (isProtected) {
    let isAccessTokenValid = false;

    // 4. Validate Access Token expiration
    if (accessToken) {
      try {
        const decoded = decodeJwt(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        // Buffer of 10 seconds to prevent edge-case expiration during transit
        if (decoded.exp && decoded.exp > currentTime + 10) {
          isAccessTokenValid = true;
        }
      } catch (error) {
        isAccessTokenValid = false; // Token is malformed
      }
    }

    // 5. Valid Access Token -> Proceed normally
    if (isAccessTokenValid) {
      return NextResponse.next();
    }

    // 6. Expired/Missing Access Token AND No Refresh Token -> Force Login
    if (!refreshToken) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    // 7. Refresh Token Exists -> Call Backend to rotate tokens
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );

      // 8. Backend rejects the refresh token -> Force Login
      if (!refreshRes.ok) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      // 9. Extract the new access token from the JSON body
      const res_data = await refreshRes.json();
      const newAccessToken = res_data.data?.accessToken;
      // console.log("This is the newAccessToken: ", newAccessToken)

      if (!newAccessToken) {
        // Failsafe: Backend responded 200 OK, but JSON is missing the token
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      // 10. Inject the new token into the headers for Next.js SSR requests
      const requestHeaders = new Headers(req.headers);
      // console.log("newAccessToken in step 10:", newAccessToken)
      requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // 11. Forward the pre-configured Set-Cookie headers from Express to the Browser
      const backendCookies = refreshRes.headers.getSetCookie();

      if (backendCookies && backendCookies.length > 0) {
        backendCookies.forEach((cookieString) => {
          // This safely copies your exact httpOnly, secure, and sameSite Express flags
          response.headers.append("Set-Cookie", cookieString);
        });
      }

      // 12. Return the modified response to complete the seamless retry
      return response;
    } catch (error) {
      // 13. Network error during the fetch -> Force Login
      console.error("Failed to proxy refresh request:", error);
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // 14. Unprotected public routes -> Proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
