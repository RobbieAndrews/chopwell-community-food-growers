import type {ArticlePortableTextBlock} from './articlePortableText'
import type {ResponsiveImageData, SanityImageWithAlt, SanitySlug} from './sanity'
import {
  getRecipeCategoryTitle,
  getRecipeDifficultyTitle,
  recipeCategoryOptions,
  recipeDifficultyOptions,
  type RecipeCategory,
  type RecipeDifficulty,
} from '../../shared/recipes'

export {getRecipeCategoryTitle, getRecipeDifficultyTitle, recipeCategoryOptions, recipeDifficultyOptions}

export interface RecipeIngredientItem {
  _key?: string
  ingredient: string
  note?: string
}

export interface RecipeIngredientSection {
  _key?: string
  title?: string
  items: RecipeIngredientItem[]
}

export interface RecipeInstructionStep {
  _key?: string
  instruction: string
}

export interface RecipeInstructionSection {
  _key?: string
  title?: string
  steps: RecipeInstructionStep[]
}

export interface RecipeSummary {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  heroImage?: SanityImageWithAlt
  category: RecipeCategory
  difficulty?: RecipeDifficulty
  servings: string
  prepTime?: string
  cookTime?: string
  keywords?: string[]
}

export interface RecipePage extends RecipeSummary {
  introContent?: ArticlePortableTextBlock[]
  ingredientSections?: RecipeIngredientSection[]
  instructionSections?: RecipeInstructionSection[]
  recipeNotes?: ArticlePortableTextBlock[]
}

export interface RecipeBrowserCard extends RecipeSummary {
  categoryLabel: string
  difficultyLabel?: string
  image: ResponsiveImageData | null
}
