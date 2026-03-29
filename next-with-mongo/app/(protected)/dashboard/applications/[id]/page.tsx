import { Application } from "../../board/_components/ApplicationCard"
import { cookies, headers } from "next/headers";

// interface ApplicationDetailsProps {
//     application: Application
// }

export default async function ApplicationDetails({ params }: { params: Promise<{ id: string }> }) {
    // 1. get the ID
    const { id } = await params;


    const cookieStore = await cookies();
    const headersList = await headers();

    let token = headersList.get("Authorization")?.split(" ")[1];
    if (!token) {
        token = cookieStore.get("accessToken")?.value
    } const NEXT_PUBLIC_PROTECTED_API_URL = process.env.NEXT_PUBLIC_PROTECTED_API_URL;

    const res = await fetch(`${NEXT_PUBLIC_PROTECTED_API_URL}/applications/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        // Optional: cache control if data changes frequently
        cache: 'no-store'
    });

    const data = await res.json();
    console.log("Application data: ", data);

    if (!res.ok) {
        console.error('Error fetching applicaton details', data.error)
        throw new Error(`Failed to fetch application with status ${res.status}`)
    }


    const application: Application = data.data.application;


    return (
        <>

            <h1>Application Details!</h1>
            {application.company}
        </>
    )
}