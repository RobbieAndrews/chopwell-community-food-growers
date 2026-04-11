import {useDeferredValue, useEffect, useMemo} from 'react'
import {Filter, Search, Sprout, X} from 'lucide-react'

import PaginationNav from '../PaginationNav'
import {
  growingGuideCategoryOptions,
  growingGuideSeasonOptions,
  type GrowingGuideBrowserCard,
} from '../../lib/growingGuides'
import type {GrowingGuideCategory, GrowingGuideSeason} from '../../../shared/growingGuides'
import {useUrlFilterPagination} from '../../hooks/useUrlFilterPagination'

interface GrowingGuideBrowserProps {
  guides: GrowingGuideBrowserCard[]
}

const PAGE_SIZE = 15
const validCategoryValues = new Set<GrowingGuideCategory>(
  growingGuideCategoryOptions.map((option) => option.value),
)
const validSeasonValues = new Set<GrowingGuideSeason>(
  growingGuideSeasonOptions.map((option) => option.value),
)
const initialFilters = {
  searchTerm: '',
  selectedCategory: '',
  selectedSeason: '',
}
const filterConfig = {
  searchTerm: {queryParam: 'q'},
  selectedCategory: {
    queryParam: 'category',
    isValid: (value: string) => validCategoryValues.has(value as GrowingGuideCategory),
  },
  selectedSeason: {
    queryParam: 'season',
    isValid: (value: string) => validSeasonValues.has(value as GrowingGuideSeason),
  },
}

export default function GrowingGuideBrowser({guides}: GrowingGuideBrowserProps) {
  const {
    filters: {searchTerm, selectedCategory, selectedSeason},
    currentPage,
    setFilter,
    replaceFilters,
    goToPage,
    replacePage,
  } = useUrlFilterPagination({
    initialFilters,
    filterConfig,
  })
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const filteredGuides = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase()

    return guides.filter((guide) => {
      const matchesSearch =
        !query ||
        [guide.title, guide.excerpt, ...(guide.keywords ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesCategory = !selectedCategory || guide.category === selectedCategory
      const matchesSeason = !selectedSeason || guide.seasons.includes(selectedSeason as never)

      return matchesSearch && matchesCategory && matchesSeason
    })
  }, [deferredSearchTerm, guides, selectedCategory, selectedSeason])

  const totalResults = filteredGuides.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const normalizedCurrentPage = Math.min(currentPage, totalPages)
  const paginatedGuides = useMemo(() => {
    const startIndex = (normalizedCurrentPage - 1) * PAGE_SIZE

    return filteredGuides.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredGuides, normalizedCurrentPage])
  const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedSeason)

  useEffect(() => {
    if (currentPage !== normalizedCurrentPage) {
      replacePage(normalizedCurrentPage)
    }
  }, [currentPage, normalizedCurrentPage, replacePage])

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-green-900/10 bg-white/85 p-5 shadow-lg shadow-green-950/5 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
              <Filter className="h-4 w-4" />
              <span>Find the right guide for the season</span>
            </div>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Search by crop name or keyword, then narrow things down by vegetable group or
              the time of year you want to grow.
            </p>
          </div>

          <div className="rounded-full bg-[var(--ccfg-cream)] px-4 py-2 text-sm font-semibold text-[var(--ccfg-forest)]">
            {totalResults} guide{totalResults === 1 ? '' : 's'} found
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(12rem,0.8fr)_minmax(12rem,0.8fr)]">
          <label className="relative block">
            <span className="sr-only">Search guides</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setFilter('searchTerm', event.target.value)}
              placeholder="Search carrots, sowing, raised beds..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={selectedCategory}
              onChange={(event) => setFilter('selectedCategory', event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white"
            >
              <option value="">All categories</option>
              {growingGuideCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Filter by season</span>
            <select
              value={selectedSeason}
              onChange={(event) => setFilter('selectedSeason', event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white"
            >
              <option value="">All seasons</option>
              {growingGuideSeasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {hasActiveFilters ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => replaceFilters(initialFilters)}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              <span>Clear filters</span>
            </button>
          </div>
        ) : null}
      </section>

      {totalResults ? (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedGuides.map((guide) => (
              <a
                key={guide._id}
                href={`/growing-guides/${guide.slug.current}`}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[linear-gradient(135deg,#e7f3dc_0%,#f6f4eb_52%,#dceccb_100%)]">
                  {guide.image ? (
                    <img
                      src={guide.image.src}
                      srcSet={guide.image.srcSet}
                      sizes={guide.image.sizes}
                      alt={guide.image.alt}
                      loading="lazy"
                      decoding="async"
                      width={guide.image.width}
                      height={guide.image.height}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--ccfg-forest)]">
                      <Sprout className="h-14 w-14" />
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-green-800">
                      {guide.categoryLabel}
                    </span>
                    {guide.difficultyLabel ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-amber-900">
                        {guide.difficultyLabel}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                    {guide.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-base leading-7 text-gray-600">
                    {guide.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {guide.seasonLabels.map((season) => (
                      <span
                        key={`${guide._id}-${season}`}
                        className="rounded-full bg-[var(--ccfg-cream)] px-3 py-1 text-xs font-semibold text-[var(--ccfg-forest)]"
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <PaginationNav
            currentPage={normalizedCurrentPage}
            totalPages={totalPages}
            ariaLabel="Growing guide pagination"
            onPageChange={goToPage}
          />
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white/80 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">No guides match those filters</h2>
          <p className="mt-3 text-base leading-7 text-gray-600">
            Try a broader search or clear the filters to browse every growing guide.
          </p>
        </div>
      )}
    </div>
  )
}
