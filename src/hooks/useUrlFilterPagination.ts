import {useEffect, useRef, useState} from 'react'

type HistoryUpdateMode = 'replace' | 'push'

interface FilterConfig {
  queryParam: string
  isValid?: (value: string) => boolean
}

interface UrlFilterPaginationOptions<TFilters extends Record<string, string>> {
  initialFilters: TFilters
  filterConfig: {[K in keyof TFilters]: FilterConfig}
}

interface ParsedUrlState<TFilters extends Record<string, string>> {
  filters: TFilters
  currentPage: number
}

function parsePageValue(value: string | null) {
  const parsedValue = Number.parseInt(value ?? '', 10)

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1
}

function parseStateFromSearch<TFilters extends Record<string, string>>(
  search: string,
  initialFilters: TFilters,
  filterConfig: {[K in keyof TFilters]: FilterConfig},
): ParsedUrlState<TFilters> {
  const params = new URLSearchParams(search)
  const filters = {...initialFilters}

  for (const key of Object.keys(initialFilters) as Array<keyof TFilters>) {
    const {queryParam, isValid} = filterConfig[key]
    const nextValue = params.get(queryParam)?.trim() ?? ''

    filters[key] = (
      nextValue && (!isValid || isValid(nextValue)) ? nextValue : initialFilters[key]
    ) as TFilters[keyof TFilters]
  }

  return {
    filters,
    currentPage: parsePageValue(params.get('page')),
  }
}

function buildSearchParams<TFilters extends Record<string, string>>(
  filters: TFilters,
  initialFilters: TFilters,
  filterConfig: {[K in keyof TFilters]: FilterConfig},
  currentPage: number,
) {
  const params = new URLSearchParams()

  for (const key of Object.keys(filters) as Array<keyof TFilters>) {
    const value = filters[key].trim()

    if (value && value !== initialFilters[key]) {
      params.set(filterConfig[key].queryParam, value)
    }
  }

  if (currentPage > 1) {
    params.set('page', String(currentPage))
  }

  return params.toString()
}

export function useUrlFilterPagination<TFilters extends Record<string, string>>({
  initialFilters,
  filterConfig,
}: UrlFilterPaginationOptions<TFilters>) {
  const [filters, setFilters] = useState(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasLoadedUrlState, setHasLoadedUrlState] = useState(false)
  const historyUpdateModeRef = useRef<HistoryUpdateMode>('replace')

  useEffect(() => {
    const syncStateFromUrl = () => {
      const nextState = parseStateFromSearch(window.location.search, initialFilters, filterConfig)

      setFilters(nextState.filters)
      setCurrentPage(nextState.currentPage)
      setHasLoadedUrlState(true)
      historyUpdateModeRef.current = 'replace'
    }

    syncStateFromUrl()
    window.addEventListener('popstate', syncStateFromUrl)

    return () => window.removeEventListener('popstate', syncStateFromUrl)
  }, [filterConfig, initialFilters])

  useEffect(() => {
    if (!hasLoadedUrlState) {
      return
    }

    const nextSearch = buildSearchParams(
      filters,
      initialFilters,
      filterConfig,
      currentPage,
    )
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname
    const currentUrl = `${window.location.pathname}${window.location.search}`

    if (nextUrl !== currentUrl) {
      if (historyUpdateModeRef.current === 'push') {
        window.history.pushState(window.history.state, '', nextUrl)
      } else {
        window.history.replaceState(window.history.state, '', nextUrl)
      }
    }

    historyUpdateModeRef.current = 'replace'
  }, [currentPage, filterConfig, filters, hasLoadedUrlState, initialFilters])

  function setFilter<K extends keyof TFilters>(key: K, value: TFilters[K]) {
    historyUpdateModeRef.current = 'replace'
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
    setCurrentPage(1)
  }

  function replaceFilters(nextFilters: TFilters) {
    historyUpdateModeRef.current = 'replace'
    setFilters(nextFilters)
    setCurrentPage(1)
  }

  function goToPage(page: number) {
    historyUpdateModeRef.current = 'push'
    setCurrentPage(page)
  }

  function replacePage(page: number) {
    historyUpdateModeRef.current = 'replace'
    setCurrentPage(page)
  }

  return {
    filters,
    currentPage,
    setFilter,
    replaceFilters,
    goToPage,
    replacePage,
  }
}
