import {useEffect, useMemo, useState} from 'react'
import {ChefHat, Flame, Printer, ShieldCheck, Timer, Users} from 'lucide-react'

import type {RecipeIngredientSection, RecipeInstructionSection} from '../../lib/recipes'

interface RecipeDetailPanelProps {
  servings: string
  prepTime?: string
  cookTime?: string
  ingredientSections: RecipeIngredientSection[]
  instructionSections: RecipeInstructionSection[]
}

const statCardClasses =
  'rounded-[1.75rem] bg-[#17324c] px-5 py-4 text-white shadow-lg shadow-slate-950/15'

export default function RecipeDetailPanel({
  cookTime,
  ingredientSections,
  instructionSections,
  prepTime,
  servings,
}: RecipeDetailPanelProps) {
  const ingredientIds = useMemo(
    () =>
      ingredientSections.flatMap((section) =>
        section.items.map((item, index) => item._key || `${section._key || section.title || 'section'}-${index}`)
      ),
    [ingredientSections]
  )
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({})
  const [cookMode, setCookMode] = useState(false)

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null

    async function enableWakeLock() {
      if (!cookMode || typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
        return
      }

      try {
        wakeLock = await navigator.wakeLock.request('screen')
      } catch {
        wakeLock = null
      }
    }

    enableWakeLock()

    return () => {
      void wakeLock?.release()
    }
  }, [cookMode])

  useEffect(() => {
    if (!cookMode) {
      return
    }

    document.body.classList.add('recipe-cook-mode')

    return () => {
      document.body.classList.remove('recipe-cook-mode')
    }
  }, [cookMode])

  function toggleIngredient(id: string) {
    setCheckedIngredients((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  function resetIngredientChecks() {
    setCheckedIngredients({})
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <article className={statCardClasses}>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#f7b7a2]" />
            <h2 className="text-lg font-semibold">Servings</h2>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">{servings}</p>
        </article>

        <article className={statCardClasses}>
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-[#f7b7a2]" />
            <h2 className="text-lg font-semibold">Prep</h2>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">{prepTime || 'See method'}</p>
        </article>

        <article className={statCardClasses}>
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-[#f7b7a2]" />
            <h2 className="text-lg font-semibold">Cook</h2>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">{cookTime || 'See method'}</p>
        </article>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-[#dfecef] px-6 py-3 font-semibold text-[#17324c] transition hover:bg-[#d3e2e6]"
        >
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </button>

        <button
          type="button"
          onClick={() => setCookMode((current) => !current)}
          aria-pressed={cookMode}
          className={[
            'inline-flex items-center gap-3 rounded-full px-5 py-3 font-semibold transition',
            cookMode
              ? 'bg-[#17324c] text-white'
              : 'bg-white text-[#17324c] ring-1 ring-slate-200 hover:bg-slate-50',
          ].join(' ')}
        >
          <span
            className={[
              'relative h-6 w-11 rounded-full transition',
              cookMode ? 'bg-emerald-300/50' : 'bg-slate-300',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white transition',
                cookMode ? 'left-5' : 'left-0.5',
              ].join(' ')}
            />
          </span>
          <span>Cook Mode</span>
        </button>

        <button
          type="button"
          onClick={resetIngredientChecks}
          disabled={!ingredientIds.some((id) => checkedIngredients[id])}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-600 ring-1 ring-slate-200 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Reset checks</span>
        </button>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-8">
          <div className="flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-[#f77663]" />
            <h2 className="text-3xl font-semibold text-[#f77663]">Ingredients</h2>
          </div>

          <div className="mt-6 space-y-6">
            {ingredientSections.map((section, sectionIndex) => (
              <div key={section._key || `${section.title || 'ingredients'}-${sectionIndex}`}>
                {section.title ? (
                  <h3 className="text-xl font-bold uppercase tracking-[0.08em] text-[#17324c]">
                    {section.title}
                  </h3>
                ) : null}

                <ul className="mt-4 space-y-3">
                  {section.items.map((item, index) => {
                    const ingredientId =
                      item._key || `${section._key || section.title || 'section'}-${index}`

                    return (
                      <li key={ingredientId} className="flex items-start gap-3">
                        <label className="mt-0.5 inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={Boolean(checkedIngredients[ingredientId])}
                            onChange={() => toggleIngredient(ingredientId)}
                            className="sr-only"
                          />
                          <span
                            className={[
                              'flex h-6 w-6 items-center justify-center rounded-sm border transition',
                              checkedIngredients[ingredientId]
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : 'border-slate-500 bg-white',
                            ].join(' ')}
                          >
                            {checkedIngredients[ingredientId] ? '✓' : ''}
                          </span>
                        </label>

                        <div className="min-w-0 text-lg leading-8 text-slate-800">
                          <span
                            className={
                              checkedIngredients[ingredientId] ? 'line-through opacity-60' : ''
                            }
                          >
                            {item.ingredient}
                          </span>
                          {item.note ? (
                            <span className="text-slate-400 italic"> {item.note}</span>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-8">
          <h2 className="text-3xl font-semibold text-[#f77663]">Instructions</h2>

          <div className="mt-6 space-y-8">
            {instructionSections.map((section, sectionIndex) => (
              <div key={section._key || `${section.title || 'method'}-${sectionIndex}`}>
                {section.title ? (
                  <h3 className="text-xl font-bold uppercase tracking-[0.08em] text-[#17324c]">
                    {section.title}
                  </h3>
                ) : null}

                <ol className="mt-4 space-y-4">
                  {section.steps.map((step, index) => (
                    <li
                      key={step._key || `${section._key || section.title || 'method'}-${index}`}
                      className="grid gap-3 sm:grid-cols-[auto_1fr]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#17324c] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <p className="text-lg leading-8 text-slate-800">{step.instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
