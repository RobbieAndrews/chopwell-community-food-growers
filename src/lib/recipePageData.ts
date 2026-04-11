import {sanityClient} from 'sanity:client'

import type {RecipePage} from './recipes'

export const RECIPE_SLUGS_QUERY = `*[
  _type == "recipe"
  && defined(slug.current)
]{
  "params": { "slug": slug.current }
}`

export const RECIPE_QUERY = `*[
  _type == "recipe"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  excerpt,
  heroImage,
  category,
  difficulty,
  servings,
  prepTime,
  cookTime,
  keywords,
  introContent,
  ingredientSections,
  instructionSections,
  recipeNotes
}`

export async function fetchRecipeSlugs(): Promise<{params: {slug: string}}[]> {
  return await sanityClient.fetch(RECIPE_SLUGS_QUERY)
}

export async function fetchRecipePage(slug: string) {
  return await sanityClient.fetch<RecipePage | null>(RECIPE_QUERY, {slug})
}
