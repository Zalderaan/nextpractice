import AppHeader from "@/components/app-header";
import { LandingFeatureCardContainer } from "@/components/LandingFeatureCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 min-h-0">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row min-h-screen gap-8 lg:gap-16 items-center px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
          <div className="w-full lg:w-1/2 space-y-4">
            <Badge>Internal tool for job-seekers</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">Manage your Applications with Visual Clarity</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">A single-user desktop application for tracking job applications through every stage of the hiring process. Organize, filter, and monitor your job search with a clean Kanban board interface.</p>
            <Button size={"lg"}>Get Started</Button>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-video">
              <Image 
                src="https://placehold.co/1180x720.png" 
                alt="Hero section image" 
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="flex flex-col items-center justify-center min-h-screen bg-secondary px-4 sm:px-6 lg:px-12 py-12 lg:py-20 space-y-8 lg:space-y-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Core features</h2>
            <p className="text-muted-foreground mt-2">Everything you need to stay organized during your job search</p>
          </div>
          <div className="w-full">
            <LandingFeatureCardContainer />
          </div>
        </section>

        {/* Stay Focused on What Matters */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
          Test
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-secondary px-4 sm:px-6 lg:px-12 py-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Ready to organize your job search?</h2>
            <p className="text-muted-foreground max-w-2xl">Start tracking your applications with a low-fidelity, high-productivity tool designed for desktop workflow.</p>
          </div>
          <Button size="lg">
            Open Dashboard
            <ArrowRight className="ml-2" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between gap-4 py-8 px-4 sm:px-6 lg:px-12 border-t">
          <span>footer test</span>
          <span>test</span>
        </footer>
      </main>
    </>
  );
}
