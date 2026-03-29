import { cookies, headers } from 'next/headers';

export default async function ApplicationsPage() {
    const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL

    const cookieStore = await cookies();
    const headersList = await headers();
    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) {
        token = cookieStore.get("accessToken")?.value
    }
    const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        // Optional: cache control if data changes frequently
        cache: 'no-store'
    });

    if (!res.ok) {
        console.error("Error fetching applications! MORE LOGGING ERRORS NEEDED HERE")
    }

    const data = await res.json();

    return (
        <main className='p-(--dashboard-pages-padding)'>
            <div>
                <h1>Applications Data</h1>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </main>
    )
}