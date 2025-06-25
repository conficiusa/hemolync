import { ArrowLeft } from 'lucide-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { UserProfile } from '@/components/user-profile'
import { session } from '@/lib/data/queries/auth/refresh'

export const Route = createFileRoute('/dashboard/settings/profile')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    return await queryClient.ensureQueryData(session)
  },
})

function RouteComponent() {
  const user = Route.useLoaderData()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/dashboard/settings' })
  }

  return (
    <main className="flex gap-4 max-sm:justify-center px-2 sm:px-4 flex-col">
      <div className="flex items-center gap-4 sm:hidden">
        <span
          className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center cursor-pointer"
          onClick={handleBack}
          aria-label="Back"
          role="button"
          tabIndex={0}
        >
          <ArrowLeft />
        </span>
        <span className="text-xl font-semibold">Profile</span>
      </div>
      <UserProfile user={user.user} />
    </main>
  )
}
