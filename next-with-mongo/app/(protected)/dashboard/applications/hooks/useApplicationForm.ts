// hooks/useApplicationForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { ApplicationFormValues, fullFormSchema } from "../../types/application-form.schema";
import { updateApplicationAction } from "@/app/(protected)/dashboard/actions";
import { Application } from "../../types/application.types";
import { mapApplicationToFormValues } from "../utils/application_sheet.utils";

export function useApplicationForm(
  selectedApp: Application | null,
  onClose: () => void,
  setIsEditing: (value: boolean) => void
) {
  const router = useRouter();

  const form = useForm<z.infer<typeof fullFormSchema>>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: mapApplicationToFormValues(selectedApp), // <-- first call, on mount
  });

  // When the user clicks a different application card, reset the form to that app's values
  useEffect(() => {
    if (selectedApp) {
      form.reset(mapApplicationToFormValues(selectedApp)); // <-- subsequent calls, on app change
    }
  }, [selectedApp]);

  const onSubmit = async (data: ApplicationFormValues) => {
    const id = selectedApp?._id;
    if (!id) {
      toast.error("No application selected.");
      return;
    }

    try {
      const result = await updateApplicationAction(id, data);
      if (result.success) {
        toast.success("Application updated successfully");
        router.refresh();
      } else {
        const details = Array.isArray((result as any).details)
          ? (result as any).details
          : [];
        const first = details[0];
        const msg =
          first?.message || result.error || "Error updating application";
        toast.error(msg);
      }
    } catch (error) {
      console.error(
        "An error occurred while updating the application: ",
        error,
      );
      toast.error("Error updating application");
    } finally {
      setIsEditing(false);
    }
  };

  return { form, onSubmit };
}
