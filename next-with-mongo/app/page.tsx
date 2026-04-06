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
        <section className="flex flex-row h-4/5 space-x-16 items-center px-(--landing-pages-padding)">
          <div className="w-full space-y-4">
            <Badge>Internal tool for job-seekers</Badge>
            <h1 className="text-6xl">Manage your Applications with Visual Clarity</h1>
            <p className="text-xl">A single-user desktop application for tracking job applications through every stage of the hiring process. Organize, filter, and monitor your job search with a clean Kanban board interface.</p>
            <Button size={"lg"}>Get Started</Button>
          </div>
          <div className="flex w-full justify-end">
            <Image src={"https://placehold.co/1180x720.png"} alt={"Hero section image"} height={700} width={650} className="" />
          </div>
        </section>

        {/* Core Features */}
        <section className="flex flex-col items-center justify-center h-4/5 bg-blue-200 px-(--landing-pages-padding) py-15 space-y-15">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl">Core features</h2>
            <p className="text-muted-foreground">Everything you need to stay organized during your job search</p>
          </div>
          <LandingFeatureCardContainer />
        </section>

        {/* Stay Focused on What Matters */}
        <section className="h-full">
          Test
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center justify-center h-2/5 space-y-4 bg-red-200">
          <div className="flex flex-col items-center space-y">
            <h2 className="text-xl font-semibold">Ready to organize your job search?</h2>
            <p>Start tracking your applications with a low-fidelity, high-productivity tool designed for desktop workflow.</p>
          </div>
          <Button>
            Open Dashboard
            <ArrowRight />
          </Button>
        </section>

        {/* Footer */}
        <footer className="flex flex-row justify-between py-8 px-(--landing-pages-padding)">
          <span>footer test</span>
          <span>test</span>
        </footer>
      </main>
    </>
  );
}
