'use client';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function LanguageSelector({ langs }: { langs: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();  // Note: I renamed to searchParams for clarity
    const currentLang = searchParams.get("lang");

    console.log("=== On Render ===");
    console.log("searchParams object:", searchParams);  // The URLSearchParams instance
    console.log("searchParams.toString():", searchParams.toString());  // e.g., "lang=en"
    console.log("currentLang (from .get('lang')):", currentLang);  // e.g., "en" or null

    const handleLangClick = useCallback((lang: string) => {
        console.log("=== handleLangClick Called ===");
        console.log("Clicked lang:", lang);

        // Step 1: Create a copy of current searchParams
        const params = new URLSearchParams(searchParams.toString());
        console.log("Step 1 - Copied params object:", params);
        console.log("params.toString() (copy):", params.toString());

        // Step 2: Modify the copy by setting the new 'lang'
        params.set("lang", lang);
        console.log("Step 2 - After params.set('lang', lang):", params);
        console.log("params.toString() (after set):", params.toString());

        // Step 3: Update the URL with the new params
        const newUrl = `?${params.toString()}`;
        console.log("Step 3 - New URL to replace:", newUrl);
        router.replace(newUrl);
        console.log("URL updated! Page will re-render with new searchParams.");
    }, [router, searchParams]);

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Supported Languages</h2>
            <ul className="flex flex-wrap gap-2">
                {langs.map((lang) => (
                    <li key={lang}>
                        <Button
                            onClick={() => handleLangClick(lang)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${currentLang === lang
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {lang.toUpperCase()}
                        </Button>
                    </li>
                ))}
            </ul>
        </section>
    );
}