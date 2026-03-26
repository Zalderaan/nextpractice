'use client'

import { Button } from "@/components/ui/button"
import { authedFetch } from "@/lib/auth_fetch"

export default function ProtectedPage() {

    const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;

    async function testSend() {
        try {
            console.log("testSend called");
            const res = await authedFetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/test_protected`);
            console.log("Fetch completed, status:", res.status);
            if (res.ok) {
                const data = await res.json();
                console.log("This is data: ", data);
            } else {
                console.error("Fetch failed with status:", res.status, res.statusText);
            }
        } catch (error) {
            console.error("Error in testSend:", error);
        }
    }

    return (
        <main className="flex flex-col flex-1 h-full items-center justify-start space-y-2">

            {/* Header section */}
            <section className="w-full">
                <h1 className="text-4xl font-semibold">Home</h1>
                <p>Subtitles here</p>
            </section>
            
            {/* Quick actions section */}
            <section className="bg-accent py-4 px-2 rounded-lg w-full">
                <span>Quick actions here</span>
            </section>


            {/* Main analytics section */}
            <section className="w-full">
                <Button onClick={() => testSend()}>
                    testing
                </Button>
            </section>
        </main>
    )
}