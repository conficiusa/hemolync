import { z } from 'zod'
import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router'
import BloodRequestForm from '@/components/request-form'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  COMBINED_TAB_VALUES,
  DEFAULT_TAB,
} from '@/lib/types/request-management.types'

export const RequestTabSchema = z.object({
  from: z
    .enum(COMBINED_TAB_VALUES)
    .catch(DEFAULT_TAB),
  edit: z.boolean().optional(),
})
export const Route = createFileRoute('/dashboard/request-management/new/')({
  validateSearch: (search) => RequestTabSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const search = getRouteApi('/dashboard/request-management/new/').useSearch()
  return (
    <main className="flex-1 bg-[#f2f4f7] p-6">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/dashboard/request-management"
                search={{ tab: search.from }}
              >
                Request Management
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary">
              New Request
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Blood request filters section */}
      <BloodRequestForm from={search.from} edit={search.edit} />
    </main>
  )
}
