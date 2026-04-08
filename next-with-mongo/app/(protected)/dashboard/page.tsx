'use client'

import { Button } from "@/components/ui/button"
// import { authedFetch } from "@/lib/auth_fetch"

export default function ProtectedPage() {

    const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;
    return (
        <main className="flex flex-col flex-1 h-full items-center justify-start space-y-2 p-(--dashboard-pages-padding)">

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
                {/* <Button onClick={() => testSend()}> */}

                <Button>
                    testing
                </Button>
            </section>
        </main>
    )
}