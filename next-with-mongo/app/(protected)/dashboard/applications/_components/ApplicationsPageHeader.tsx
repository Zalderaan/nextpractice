'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, TableOfContents } from "lucide-react";
import { AddApplicationDialog } from "../../board/_components/AddApplicationDialog";
import { Application } from "../../board/_components/ApplicationCard";
import Papa from 'papaparse';

interface ApplicationsPageHeaderProps {
    applications: Application[];
}

export function ApplicationsPageHeader({ applications }: ApplicationsPageHeaderProps) {

    const handleExport = () => {
        const csv = Papa.unparse(applications);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'applications.csv');
        link.click();
    }

    return (
        <header className="flex flex-row items-center justify-between px-(--header-px) shrink-0 bg-sidebar border-b h-(--header-height)">
            <div className='flex flex-row items-center space-x-4'>
                <Input
                    placeholder="Search applications..."
                />
                <Button variant={'outline'}><Filter /></Button>
            </div>

            <div className="flex flex-row space-x-2">
                <Button
                    className="flex flex-row items-center px-2"
                    variant={'outline'}
                    onClick={handleExport}
                    disabled={(applications.length < 1)}
                >
                    <Download />
                    <span>Export</span>
                </Button>
                <AddApplicationDialog />
            </div>
        </header>
    )
}