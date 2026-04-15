import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDismissReasonDialogStore } from "../_stores/dismiss-reason-dialog.store";

export function DismissNotification() {
    const { app, reason, isOpen, closeDialog } = useDismissReasonDialogStore();

    if (!app) return;
    const { company, role } = app

    return (
        <AlertDialog open={isOpen} onOpenChange={closeDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Dismiss notification?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs">You won't see this kind of notificaiton for this specific application again</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 rounded-md border border-destructive/20 bg-destructive/5 p-4">
                    <div className="grid grid-cols-1 gap-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Company
                        </p>
                        <p className="font-semibold text-foreground">{company}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Role
                        </p>
                        <p className="text-sm text-foreground">{role}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Notification
                        </p>
                        <p className="text-sm text-foreground">{reason}</p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant={"destructive"}>
                        Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}