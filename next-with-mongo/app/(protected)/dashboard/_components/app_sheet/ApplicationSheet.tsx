"use client"

import { useState } from "react"
import { useApplicationForm } from "../../applications/hooks/useApplicationForm"
import { Application } from "../../types/application.types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ApplicationSheetSkeleton } from "../../board/_components/ApplicationSheetSkeleton";
import { ApplicationSheetHeader } from "./ApplicationSheetHeader";
import { Button } from "@/components/ui/button";
import { Pencil, LinkIcon } from "lucide-react";
import Link from "next/link";
import { ApplicationDetails } from "./ApplicationDetails";
import { ApplicationSheetFooter } from "./ApplicationSheetFooter";
import { mapApplicationToFormValues } from "../../applications/utils/application_sheet.utils";
import { AppliedStatusFields } from "./AppliedStatusFields";
import { OfferStatusFields } from "./OfferStatusFields";
import { InterviewStatusFields } from "./InterviewStatusFields";
import { AdditionalNotes } from "./ApplicaitonAdditionalNotes";
import { useApplicationSheetStore } from "./app_sheet.store";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormProvider } from "react-hook-form";

export function ApplicationSheet() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        selectedApp,
        isOpen,
        isEditing,
        isRefreshing,
        closeSheet,
        setIsEditing,
    } = useApplicationSheetStore();

    const handleClose = () => {
        // clear zustand sheet 
        closeSheet();
        // --> will call selectedApp = null, setIsEditing & isRefreshing = false

        // clear URL params
        const params = new URLSearchParams(searchParams.toString())
        params.delete('appId')
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }

    const { form, onSubmit } = useApplicationForm(selectedApp, handleClose, setIsEditing)
    const { handleSubmit, control, watch, setValue, getValues, formState: { isSubmitting } } = form;

    const watched_worktype = watch('workType');
    const watched_status = watch('status')
    const isApplyDateRequired = watched_status === 'applied'
    const isLocationRequired = watched_worktype === 'onsite' || watched_worktype === 'hybrid';

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
            <SheetContent className="w-full sm:max-w-135 flex flex-col p-0 overflow-hidden">
                <FormProvider {...form}>
                    {isRefreshing && <ApplicationSheetSkeleton />}

                    {selectedApp && (
                        <form
                            id='update-application-form'
                            onSubmit={handleSubmit(onSubmit)}
                            className='flex flex-col h-full'
                        >
                            <ApplicationSheetHeader
                                selectedApp={selectedApp}
                                isEditing={isEditing}
                                control={control}
                            />

                            <main className="flex-1 overflow-y-auto px-6 p-4 space-y-8">
                                {/* Action Buttons */}
                                {!isEditing && (
                                    <section className="flex items-center w-full gap-3">
                                        <Button type="button" className="flex-1" variant="secondary" onClick={() => setIsEditing(true)}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>

                                        {selectedApp.jobUrl ? (
                                            <Button asChild type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                                <Link href={selectedApp.jobUrl} target="_blank" rel="noopener noreferrer">
                                                    <LinkIcon className="w-4 h-4 mr-2" />
                                                    View Job
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button disabled variant="outline" className="flex-1">
                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                No job URL
                                            </Button>
                                        )}
                                    </section>
                                )}
                                <ApplicationDetails
                                    selectedApp={selectedApp}
                                    control={control}
                                    getValues={getValues}
                                    setValue={setValue}
                                    isApplyDateRequired={isApplyDateRequired}
                                    isLocationRequired={isLocationRequired}
                                    isEditing={isEditing}
                                />

                                {/* Status-specific */}

                                {watched_status === "applied" && (
                                    <AppliedStatusFields
                                        control={control}
                                        isEditing={isEditing}
                                        selectedApp={selectedApp}
                                    />
                                )}

                                {watched_status === "interview" && (
                                    <InterviewStatusFields
                                        control={control}
                                        isEditing={isEditing}
                                        selectedApp={selectedApp}
                                    />
                                )}

                                {watched_status === "offer" && (
                                    <OfferStatusFields
                                        control={control}
                                        isEditing={isEditing}
                                        selectedApp={selectedApp}
                                    />
                                )}

                                {/* Additional notes */}
                                <AdditionalNotes
                                    control={control}
                                    isEditing={isEditing}
                                    selectedApp={selectedApp}
                                />
                            </main>

                            <ApplicationSheetFooter
                                selectedApp={selectedApp}
                                isEditing={isEditing}
                                isSubmitting={isSubmitting}
                                onCancel={() => {
                                    form.reset(mapApplicationToFormValues(selectedApp))
                                    setIsEditing(false)
                                }}
                                onClose={handleClose}
                            />
                        </form>
                    )}
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}