import { memo, useCallback, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMutateStaff } from '@/lib/data/mutations/mutate-staff'

export const DeleteUserDialog = memo(function DeleteUserDialog({
  id,
}: {
  id: string
}) {
  const {
    deleteStaffMutation: { mutate },
  } = useMutateStaff()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleOpenChange = useCallback((open: boolean) => setIsOpen(open), [])

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success('User deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['staff'] })
      },
      onError: () => {
        toast.error('Failed to delete user')
      },
    })
  }
  return (
    <>
      <button
        onClick={handleOpen}
        className="p-1 text-muted-foreground hover:text-foreground"
      >
        <Trash2 size={14} />
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[300px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-semibold">
              Remove User
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-6 text-center">
            <p className="text-muted-foreground text-sm">
              Are you sure you want to remove this User? You can add the user
              anytime
            </p>
          </div>
          <DialogFooter className="px-6 py-4 flex justify-between gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              onClick={handleDelete}
            >
              Remove
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
})

DeleteUserDialog.displayName = 'DeleteUserDialog'
