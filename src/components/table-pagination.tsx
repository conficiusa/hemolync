import { memo, useMemo } from 'react'
import type { Pagination as PaginationType } from '@/lib/types/system-types'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { generatePages } from '@/lib/utils'

// Allow an optional page-change callback while keeping backwards compatibility
interface TablePaginationProps extends PaginationType {
  onPageChange?: (page: number) => void
}

const TablePagination = memo((props: TablePaginationProps) => {
  const { current_page, total_pages, has_next, has_prev, onPageChange } = props

  const pages = useMemo(
    () => generatePages(current_page, total_pages),
    [current_page, total_pages],
  )

  const handleChange = (page: number) => {
    if (onPageChange) onPageChange(page)
  }

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!has_prev}
            disabled={!has_prev}
            tabIndex={!has_prev ? -1 : 0}
            onClick={() => has_prev && handleChange(current_page - 1)}
          />
        </PaginationItem>

        {pages.map((p: number | 'ellipsis', idx: number) => (
          <PaginationItem key={`${p}-${idx}`}>
            {p === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={p === current_page}
                onClick={() => handleChange(p)}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!has_next}
            disabled={!has_next}
            tabIndex={!has_next ? -1 : 0}
            onClick={() => has_next && handleChange(current_page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
})

TablePagination.displayName = 'TablePagination'

export default TablePagination
