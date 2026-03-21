import { ChatBox } from "@/app/dashboard/chat/_components/ChatBox"


export default function ChatPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
            <h1 className="text-3xl">Prompt away at your blog posts</h1>
            <ChatBox />
        </div>
    )
}