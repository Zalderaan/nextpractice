import Link from "next/link";

const dummyPosts = [
    {
        id: 1,
        title: "Getting Started with Next.js",
        content: "Next.js is a powerful React framework for building server-side rendered applications. It provides features like automatic code splitting, optimized performance, and easy deployment.",
        createdAt: "2023-10-01",
    },
    {
        id: 2,
        title: "Understanding TypeScript in React",
        content: "TypeScript adds static typing to JavaScript, making your React code more robust and easier to maintain. Learn how to integrate it with your Next.js project.",
        createdAt: "2023-10-05",
    },
    {
        id: 3,
        title: "Building Responsive UIs with Tailwind CSS",
        content: "Tailwind CSS is a utility-first CSS framework that helps you build responsive designs quickly. Combine it with your Next.js app for a seamless development experience.",
        createdAt: "2023-10-10",
    },
    {
        id: 4,
        title: "State Management in React Apps",
        content: "Managing state in React can be tricky. Explore options like useState, useReducer, and libraries like Zustand or Redux for complex applications.",
        createdAt: "2023-10-15",
    },
    {
        id: 5,
        title: "Deploying Next.js Apps to Vercel",
        content: "Vercel is the easiest way to deploy Next.js applications. With automatic scaling and global CDN, your app will be fast and reliable.",
        createdAt: "2023-10-20",
    },
];

export default function PostsPage() {
    return (
        <>
            <span>
                Posts page
            </span>

            {/* Posts container */}
            <div className="flex flex-col space-y-4 px-4 py-2 border-2">
                {
                    dummyPosts.map((post) => (
                        <Link href={`/dashboard/posts/${post.id}`}>
                            <div key={post.id} className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-xl font-semibold">{post.title}</h2>
                                <p className="text-gray-600 text-sm mb-2">Created on: {post.createdAt}</p>
                                <p className="text-gray-800">{post.content}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>

        </>
    )
}