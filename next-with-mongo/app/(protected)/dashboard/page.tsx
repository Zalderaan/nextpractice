'use client'

import { Button } from "@/components/ui/button"
import { authedFetch } from "@/lib/auth_fetch"

export default function ProtectedPage() {

    const API_BASE_URL = 'http://localhost:5000'
    
    async function testSend() {
        try {
            console.log("testSend called");
            const res = await authedFetch(`${API_BASE_URL}/api/protected`);
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
        <>
            test dashboarded

            <Button onClick={() => testSend()}>
                testing
            </Button>
        </>
    )
}