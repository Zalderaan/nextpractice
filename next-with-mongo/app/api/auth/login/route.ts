import { NextResponse } from "next/server";

const NEXT_PUBLIC_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function POST(req: Request) {
    const body = await req.json();
    console.log("this is NEXT_public_BASE_api_url: ", NEXT_PUBLIC_BASE_API_URL)

    const backendRes = await fetch(`${NEXT_PUBLIC_BASE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await backendRes.json();
    const res = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) res.headers.set("set-cookie", setCookie);

    return res;
}