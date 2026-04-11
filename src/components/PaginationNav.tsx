import {ChevronLeft, ChevronRight} from 'lucide-react'

interface PaginationNavProps {
  currentPage: number
  totalPages: number
  ariaLabel: string
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({length: totalPages}, (_, index) => index + 1)
  }

  const visiblePageNumbers = new Set<number>([1, totalPages, currentPage])

  if (currentPage > 1) {
    visiblePageNumbers.add(currentPage - 1)
  }

  if (currentPage < totalPages) {
    visiblePageNumbers.add(currentPage + 1)
  }

  for (let distance = 2; visiblePageNumbers.size < 5; distance += 1) {
    const previousCandidate = currentPage - distance
    const nextCandidate = currentPage + distance

    if (previousCandidate > 1) {
      visiblePageNumbers.add(previousCandidate)
    }

    if (visiblePageNumbers.size >= 5) {
      break
    }

    if (nextCandidate < totalPages) {
      visiblePageNumbers.add(nextCandidate)
    }
  }

  const sortedPageNumbers = Array.from(visiblePageNumbers).sort((left, right) => left - right)
  const visiblePages: Array<number | 'ellipsis'> = []

  for (const [index, pageNumber] of sortedPageNumbers.entries()) {
    if (index > 0 && pageNumber - sortedPageNumbers[index - 1] > 1) {
      visiblePages.push('ellipsis')
    }

    visiblePages.push(pageNumber)
  }

  return visiblePages
}

export default function PaginationNav({
  currentPage,
  totalPages,
  ariaLabel,
  onPageChange,
}: PaginationNavProps) {
  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <nav aria-label={ariaLabel} className="flex max-w-full flex-nowrap items-center justify-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="shrink-0 rounded-full border border-gray-200 bg-white p-2 text-xs font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-gray-200 disabled:hover:text-gray-700 sm:px-4 sm:py-2 sm:text-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="shrink-0 rounded-full border border-transparent bg-transparent px-1 py-2 text-xs font-semibold text-gray-500 sm:px-2 sm:text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={
              item === currentPage
                ? 'min-w-9 shrink-0 rounded-full bg-green-700 px-2.5 py-2 text-xs font-semibold text-white shadow-sm sm:min-w-10 sm:px-4 sm:text-sm'
                : 'min-w-9 shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700 sm:min-w-10 sm:px-4 sm:text-sm'
            }
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="shrink-0 rounded-full border border-gray-200 bg-white p-2 text-xs font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-gray-200 disabled:hover:text-gray-700 sm:px-4 sm:py-2 sm:text-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
