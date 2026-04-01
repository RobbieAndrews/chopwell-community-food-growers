import {useDeferredValue, useMemo, useState} from 'react'
import {Filter, Search, UtensilsCrossed, X} from 'lucide-react'

import {recipeCategoryOptions, type RecipeBrowserCard} from '../../lib/recipes'

interface RecipeBrowserProps {
  recipes: RecipeBrowserCard[]
}

export default function RecipeBrowser({recipes}: RecipeBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const filteredRecipes = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesSearch =
        !query ||
        [recipe.title, recipe.excerpt, recipe.servings, ...(recipe.keywords ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesCategory = !selectedCategory || recipe.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [deferredSearchTerm, recipes, selectedCategory])

  const hasActiveFilters = Boolean(searchTerm || selectedCategory)

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-green-900/10 bg-white/85 p-5 shadow-lg shadow-green-950/5 backdrop-blur sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
              <Filter className="h-4 w-4" />
              <span>Browse by preserve, dish, or ingredient</span>
            </div>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Start with preserves now, then grow this into a wider community recipe library over
              time.
            </p>
          </div>

          <div className="rounded-full bg-[var(--ccfg-cream)] px-4 py-2 text-sm font-semibold text-[var(--ccfg-forest)]">
            {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'} shown
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.8fr)]">
          <label className="relative block">
            <span className="sr-only">Search recipes</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search chutney, jam, tomato sauce..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:bg-white"
            >
              <option value="">All recipe types</option>
              {recipeCategoryOptions.map((option) => (
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
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              <span>Clear filters</span>
            </button>
          </div>
        ) : null}
      </section>

      {filteredRecipes.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <a
              key={recipe._id}
              href={`/recipes/${recipe.slug.current}`}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[linear-gradient(135deg,#f1eadb_0%,#fbf8f2_52%,#dceccb_100%)]">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--ccfg-forest)]">
                    <UtensilsCrossed className="h-14 w-14" />
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-rose-700">
                    {recipe.categoryLabel}
                  </span>
                  {recipe.difficultyLabel ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-amber-900">
                      {recipe.difficultyLabel}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                  {recipe.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-base leading-7 text-gray-600">
                  {recipe.excerpt}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="rounded-2xl bg-[var(--ccfg-cream)] px-4 py-3">
                    <div className="font-semibold text-[var(--ccfg-forest)]">Yield</div>
                    <div className="mt-1">{recipe.servings}</div>
                  </div>
                  <div className="rounded-2xl bg-[var(--ccfg-cream)] px-4 py-3">
                    <div className="font-semibold text-[var(--ccfg-forest)]">Time</div>
                    <div className="mt-1">{recipe.prepTime || recipe.cookTime || 'See recipe'}</div>
                  </div>
                </div>

                <div className="mt-6 text-sm font-semibold tracking-[0.12em] uppercase text-[var(--ccfg-moss)]">
                  Open recipe
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white/80 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">No recipes match those filters</h2>
          <p className="mt-3 text-base leading-7 text-gray-600">
            Try a broader search or clear the filters to browse the whole collection.
          </p>
        </div>
      )}
    </div>
  )
}
