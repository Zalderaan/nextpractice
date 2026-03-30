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
import { Plus, PlusIcon } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { Application } from "./ApplicationCard";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
    status: string;
    applications: Application[];
    onAddApplication?: () => void;
    onSelect: (app: Application) => void; // Make this required
}

export function KanbanColumn({ status, applications, onAddApplication, onSelect }: KanbanColumnProps) {
    return (
        <Card className="flex flex-col min-w-[320px] max-h-full shrink-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between shrink-0 border-b h-full">
                <div className="flex flex-row space-x-2 item-center justify-start">
                    <CardTitle className="capitalize">{status}</CardTitle>
                    <Badge className="text-sm">{applications.length}</Badge>
                </div>

                <CardAction onClick={() => console.log(`Add application to ${status} clicked`)}>
                    <PlusIcon />
                </CardAction>
            </CardHeader>

            <CardContent className="flex-1 space-y-2 overflow-y-auto min-h-0 py-2">
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

            {/* <CardFooter className="border-t">
                <Button variant="outline" size="sm" className="w-full" onClick={onAddApplication}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Application
                </Button>
            </CardFooter> */}
        </Card>
    );
}