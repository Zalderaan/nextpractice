import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export async function POST(req: Request) {
    try {
        // Forward incoming cookies (refreshToken) to backend refresh endpoint
        const cookieHeader = req.headers.get("cookie") ?? "";

        const backendRes = await fetch(`${API_BASE_URL}/api/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {})
            },
            cache: "no-store"
        });

        const text = await backendRes.text();
        const data = text ? JSON.parse(text) : {};

        const res = NextResponse.json(data, { status: backendRes.status });

        // Forward rotated refresh cookie if backend sets one
        const setCookie = backendRes.headers.get("set-cookie");
        if (setCookie) {
            res.headers.set("set-cookie", setCookie);
        }

        return res;
    } catch {
        return NextResponse.json(
            { success: false, error: "Refresh request failed" },
            { status: 500 }
        );
    }
}