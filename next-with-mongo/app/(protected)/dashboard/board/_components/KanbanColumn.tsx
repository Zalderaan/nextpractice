'use client'

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { Application } from "./ApplicationCard";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

interface KanbanColumnProps {
    status: string;
    applications: Application[];
    onAddApplication?: () => void;
    onSelect: (app: Application) => void; // Make this required
}

export function KanbanColumn({ status, applications, onAddApplication, onSelect }: KanbanColumnProps) {
    return (
        <Card className="flex flex-col min-w-[320px] max-h-full shrink-0 overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="capitalize">{status}</CardTitle>
                <span className="text-sm text-muted-foreground">{applications.length}</span>
            </CardHeader>

            <CardContent className="flex-1 space-y-2">
                {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No applications yet.</p>
                ) : (
                    applications.map((app) => (
                        <ApplicationCard
                            key={app._id}
                            application={app}
                            onClick={() => onSelect(app)} // Pass to parent
                        />
                    ))
                )}
            </CardContent>

            <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={onAddApplication}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Application
                </Button>
            </CardFooter>
        </Card>
    );
}