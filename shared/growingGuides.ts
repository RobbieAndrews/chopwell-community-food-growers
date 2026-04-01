export const growingGuideCategoryOptions = [
  { title: 'Roots and tubers', value: 'roots-and-tubers' },
  { title: 'Leafy greens', value: 'leafy-greens' },
  { title: 'Brassicas', value: 'brassicas' },
  { title: 'Legumes', value: 'legumes' },
  { title: 'Alliums', value: 'alliums' },
  { title: 'Fruit vegetables', value: 'fruit-vegetables' },
] as const

export const growingGuideSeasonOptions = [
  { title: 'Spring', value: 'spring' },
  { title: 'Summer', value: 'summer' },
  { title: 'Autumn', value: 'autumn' },
  { title: 'Winter', value: 'winter' },
] as const

export const growingGuideDifficultyOptions = [
  { title: 'Beginner', value: 'beginner' },
  { title: 'Intermediate', value: 'intermediate' },
  { title: 'Advanced', value: 'advanced' },
] as const

export type GrowingGuideCategory =
  (typeof growingGuideCategoryOptions)[number]['value']

export type GrowingGuideSeason =
  (typeof growingGuideSeasonOptions)[number]['value']

export type GrowingGuideDifficulty =
  (typeof growingGuideDifficultyOptions)[number]['value']

export function getGrowingGuideCategoryTitle(value?: string | null) {
  return (
    growingGuideCategoryOptions.find((option) => option.value === value)?.title ??
    'Uncategorised'
  )
}

export function getGrowingGuideSeasonTitle(value?: string | null) {
  return (
    growingGuideSeasonOptions.find((option) => option.value === value)?.title ?? value ?? ''
  )
}

export function getGrowingGuideDifficultyTitle(value?: string | null) {
  return (
    growingGuideDifficultyOptions.find((option) => option.value === value)?.title ??
    'Difficulty not set'
  )
}
