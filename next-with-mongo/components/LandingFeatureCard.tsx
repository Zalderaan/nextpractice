import { LayoutGrid } from "lucide-react";
import Image from "next/image";

interface LandingFeatureCard {

}

export function LandingFeatureCardContainer() {
    return (
        <div className="flex flex-row items-center justify-between gap-4">
            <LandingFeatureCard />
            <LandingFeatureCard />
            <LandingFeatureCard />
        </div>
    )
}

export function LandingFeatureCard() {
    return (
        <div className="bg-white border border-border rounded-lg p-6 space-y-4">
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                <LayoutGrid className="w-6 h-6" />
            </div>
            <h3>Kanban Board View</h3>
            <p className="text-muted-foreground">
                Visualize your applications across five stages: Wishlist, Applied, Interview, Offer, and Rejected. Drag and drop cards as your applications progress.
            </p>
            <div className="relative w-full aspect-video">
                <Image
                    src="https://placehold.co/250x150.png"
                    alt="Hero section image"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}