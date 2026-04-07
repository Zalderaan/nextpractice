import Link from "next/link";

export default function AppHeader() {
    return (
        <header className="flex flex-row items-center justify-between space-x-4 px-(--landing-pages-padding) border-b bg-sidebar h-(--header-height)">
            <span>The Hire Wire</span>

            <div className="space-x-2">
                <Link href={'/login'}>Sign in</Link>
                <Link href={'/signup'}>Sign up</Link>
            </div>
        </header>
    )
}