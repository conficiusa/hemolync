import { toast } from 'sonner'
import { memo, useMemo, useState } from 'react'
import type {
  RequestState,
  RequestStatus,
} from '@/lib/types/request-management.types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useMutateRequest from '@/lib/data/mutations/mutate-requests'

// Reasons list (can be moved to constants if reused elsewhere)
const CANCELLATION_REASONS = [
  'Incorrect blood product',
  'Quantity no longer required',
  'Urgency resolved',
  'Duplicate request',
  'Delayed processing',
  'Other',
] as const

interface CancelRequestDialogProps {
  id: string
  request_status: RequestState
  processing_status: RequestStatus
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const CancelRequestDialog = memo<CancelRequestDialogProps>(
  ({ id, request_status, processing_status, trigger, onSuccess }) => {
    const {
      cancelRequestMutation: { mutate, isPending },
    } = useMutateRequest()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Array<string>>([])
    const [otherText, setOtherText] = useState('')

    const showOtherInput = selected.includes('Other')

    const composedReason = useMemo(() => {
      if (showOtherInput && otherText.trim()) return otherText.trim()
      if (selected.length)
        return selected.filter((r) => r !== 'Other').join(', ') || 'Other'
      return 'User cancelled request'
    }, [showOtherInput, otherText, selected])

    const toggleReason = (reason: string) => {
      setSelected((prev) =>
        prev.includes(reason)
          ? prev.filter((r) => r !== reason)
          : [...prev, reason],
      )
    }

    const handleSubmit = () => {
      mutate(
        {
          id,
          cancellation_reason: composedReason,
          request_status,
          processing_status: processing_status,
        },
        {
          onSuccess: () => {
            toast.success('Request cancelled successfully')
            setOpen(false)
            onSuccess?.()
          },
          onError: () => {
            toast.error('Failed to cancel request')
          },
        },
      )
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="destructive" size="sm">
              Cancel Request
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel request?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. You can optionally tell us why
              you're cancelling this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            <div className="space-y-3">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-start gap-3 text-sm cursor-pointer select-none"
                >
                  <Checkbox
                    checked={selected.includes(reason)}
                    onCheckedChange={() => toggleReason(reason)}
                  />
                  <span className="leading-5">{reason}</span>
                </label>
              ))}
            </div>
            {showOtherInput && (
              <div className="space-y-2 mx-2">
                <Label htmlFor="other-reason">Other reason (optional)</Label>
                <Input
                  id="other-reason"
                  placeholder="Type reason..."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Reason is optional. If you leave it blank we'll still cancel the
              request.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <DialogClose asChild>
              <Button variant="outline" size="sm" disabled={isPending}>
                Close
              </Button>
            </DialogClose>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)

export default CancelRequestDialog
