import { memo } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import checkGif from '/check.gif'

const SuccessDialog = memo(
  ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle className="text-xl font-semibold sr-only">
              Success
            </DialogTitle>
            <DialogDescription className="sr-only">
              The operation was successful.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center text-center size-[200px] mx-auto">
            <img src={checkGif} alt="Success" className="mx-auto mt-4" />
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <h2 className="font-bold">Request Sent</h2>
            <p className="text-sm text-muted-foreground">
              Your request has been successfully submitted. Please allow some
              time for us to provide feedback.
            </p>

            <div className="flex items-center justify-center mt-6">
              <button
                onClick={() => onClose()}
                type="button"
                className="px-3  py-3 min-w-[125px] bg-primary text-white rounded-full flex justify-center items-center text-sm font-medium disabled:opacity-65"
              >
                Ok
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.onClose === nextProps.onClose
    )
  },
)

SuccessDialog.displayName = 'SuccessDialog'
export { SuccessDialog }
