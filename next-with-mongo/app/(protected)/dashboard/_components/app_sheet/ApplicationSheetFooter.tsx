// components/ApplicationSheetFooter.tsx
import { Button } from '@/components/ui/button'
import { SheetFooter } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { X, Save } from 'lucide-react'
import { DeleteApplicationDialog } from '../../board/_components/DeleteApplicationDialog'
import { Application } from '../../types/application.types'

type ApplicationSheetFooterProps = {
    isEditing: boolean
    isSubmitting: boolean
    selectedApp: Application
    onCancel: () => void
    onClose: () => void
}

export function ApplicationSheetFooter({ isEditing, isSubmitting, selectedApp, onCancel, onClose }: ApplicationSheetFooterProps) {
    return (
        <SheetFooter className="px-6 py-4 border-t shrink-0 flex flex-row items-center gap-3 sm:space-x-0">
            {isEditing ? (
                <>
                    <Button
                        type="button"
                        className="flex-1"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={onCancel}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : <Save className="w-4 h-4 mr-2" />}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </>
            ) : (
                <DeleteApplicationDialog application={selectedApp} onDeleteSuccess={onClose} />
            )}
        </SheetFooter>
    )
}