import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
return (
    <div className="flex flex-col h-screen w-full items-center justify-center space-y-5">  
        <h1 className="font-bold text-4xl">
            Page not found
        </h1>
        <Button asChild>
            <Link href={'/'}>
                Go back
            </Link>
        </Button>
    </div>
)

}