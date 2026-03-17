export default async function PostDetailsPage({ params }: { params: Promise<{ uuid: string }> }) {
    const post_uuid = (await params).uuid
    return (
        <>
            <h1>{post_uuid}</h1>
            <span>Comments:</span>
        </>
    )
}