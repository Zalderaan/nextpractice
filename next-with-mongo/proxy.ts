import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard"];
const guestOnly = ["/login", "/signup"];

export function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const hasRefresh = Boolean(req.cookies.get("refreshToken")?.value);

    const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
    const isGuestOnly = guestOnly.some((p) => path.startsWith(p));

    if (isProtected && !hasRefresh) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isGuestOnly && hasRefresh) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};