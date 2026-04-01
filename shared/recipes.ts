export const recipeCategoryOptions = [
  {title: 'Preserves', value: 'preserves'},
  {title: 'Pickles and chutneys', value: 'pickles-and-chutneys'},
  {title: 'Sauces and condiments', value: 'sauces-and-condiments'},
  {title: 'Soups and stews', value: 'soups-and-stews'},
  {title: 'Bakes and desserts', value: 'bakes-and-desserts'},
  {title: 'Meals and sides', value: 'meals-and-sides'},
] as const

export const recipeDifficultyOptions = [
  {title: 'Easy', value: 'easy'},
  {title: 'Medium', value: 'medium'},
  {title: 'Advanced', value: 'advanced'},
] as const

export type RecipeCategory = (typeof recipeCategoryOptions)[number]['value']
export type RecipeDifficulty = (typeof recipeDifficultyOptions)[number]['value']

export function getRecipeCategoryTitle(value?: string | null) {
  return recipeCategoryOptions.find((option) => option.value === value)?.title ?? 'Uncategorised'
}

export function getRecipeDifficultyTitle(value?: string | null) {
  return recipeDifficultyOptions.find((option) => option.value === value)?.title ?? 'Difficulty not set'
}
