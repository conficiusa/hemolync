import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/(card-routes)/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <main className="flex justify-center items-center flex-col h-[60dvh]">
      Welcome to hemolync
      <p>(To be updated soon)</p>
    </main>
  )
}
