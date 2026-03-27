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

interface KanbanColumnProps {
  status: string;
  applications: Application[];
  onAddApplication?: () => void;
}

export function KanbanColumn({ status, applications, onAddApplication }: KanbanColumnProps) {

  return (
    <Card className="flex flex-col min-w-[320px] shrink-0 overflow-y-auto max-h-96">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="capitalize">{status}</CardTitle>
        <CardAction>
          <span className="text-sm text-muted-foreground">{applications.length}</span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app._id} application={app}/>
          ))
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onAddApplication}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </CardFooter>
    </Card>
  );
}