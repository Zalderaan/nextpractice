import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Application } from "./ApplicationCard";
import { deleteApplicationAction } from "../../actions";

interface DeleteApplicationDialogProps {
    application: Application;
    onDeleteSuccess: () => void;
}

export function DeleteApplicationDialog({ application, onDeleteSuccess }: DeleteApplicationDialogProps) {
    const { _id, company, role } = application;

    const handleDelete = async () => {
        if (!_id) return;

        try {
            const result = await deleteApplicationAction(_id);
            if (result.success) {
                onDeleteSuccess();
            } else {
                alert(result.error || "Failed to delete application.");
            }
        } catch (error) {
            alert("An unexpected error occurred.");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                    Delete Application
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-100 max-w-100">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        application record for this position.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* --- Details Display --- */}
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
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* We use the AlertDialogAction but style it as destructive. 
                        Note: AlertDialogAction handles the closing logic automatically.
                    */}
                    <AlertDialogAction
                        variant={'destructive'}
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}