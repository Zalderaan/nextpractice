'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, TableOfContents } from "lucide-react";
import Link from "next/link";
import { AddApplicationDialog } from "../../board/_components/AddApplicationDialog";

export function ApplicationsPageHeader() {
    return (
        <header className="flex flex-row items-center justify-between px-(--header-px) shrink-0 bg-sidebar border-b h-(--header-height)">
                    <div className='flex flex-row items-center space-x-4'>
                        <Input
                            placeholder="Search applications..."
                        />
                        <Button variant={'outline'}><Filter /></Button>
                    </div>
        
                    <div className="flex flex-row space-x-2">
                        <Button asChild className="flex flex-row items-center px-2" variant={'outline'}>
                            <Link href={'applications/'}>
                                <TableOfContents />
                                <span>View Applications</span>
                            </Link>
                        </Button>
                        <AddApplicationDialog />
                    </div>
                </header>
    )
}