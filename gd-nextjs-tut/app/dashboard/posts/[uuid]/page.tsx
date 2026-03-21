import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LanguageSelector } from "./_components/LanguageSelector"

export default async function PostDetailsPage({
    params,
    searchParams
}: {
    params: Promise<{ uuid: string }>;
    searchParams: Promise<{ lang?: string }>
}) {
    console.log("params on render: ", params);
    console.log("searchParams on render: ", searchParams);

    const { uuid } = await params;
    const { lang } = await searchParams;

    const langs = ["en", "ph", "es"]

    return (
        <main className="p-6 max-w-4xl w-full flex flex-col items-start">
            {/* Back Navigation */}
            <div className="mb-4">
                <Link href="/dashboard/posts">
                    <Button variant="outline" size="sm">
                        ← Back to Posts
                    </Button>
                </Link>
            </div>

            {/* Post Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Post {uuid}</h1>
                <p className="text-sm text-gray-600">
                    By author on sample date
                </p>
                {/* <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div> */}
            </header>

            {/* Post Content */}
            <section className="mb-8">
                <p className="text-gray-800 leading-relaxed">Sample content, reading in {lang}</p>
            </section>

            {/* Supported Languages */}
            <LanguageSelector langs={langs} />

            {/* Comments Section */}
            <section>
                <h2 className="text-xl font-semibold mb-3">Comments</h2>
                <div className="space-y-4">
                    {/* Placeholder for comments */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="text-gray-600 italic">No comments yet. Be the first to comment!</p>
                    </div>
                    {/* Add Comment Form (placeholder) */}
                    <div className="p-4 border rounded-lg">
                        <textarea
                            className="w-full p-2 border rounded-md resize-none"
                            rows={3}
                            placeholder="Add a comment..."
                        />
                        <Button className="mt-2" size="sm">
                            Submit Comment
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}