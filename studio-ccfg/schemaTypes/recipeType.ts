import {defineArrayMember, defineField, defineType} from 'sanity'
import {articleContentMembers} from './articleContent'
import {
  getRecipeCategoryTitle,
  getRecipeDifficultyTitle,
  recipeCategoryOptions,
  recipeDifficultyOptions,
} from '../../shared/recipes'

export const recipeType = defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Recipe name',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short description',
      description: 'Shown on recipe cards and near the top of the recipe page.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: recipeCategoryOptions.map(({title, value}) => ({title, value})),
      },
      initialValue: 'preserves',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: recipeDifficultyOptions.map(({title, value}) => ({title, value})),
      },
    }),
    defineField({
      name: 'servings',
      title: 'Servings / yield',
      description: 'Examples: 6 jars, 8 portions, 24 biscuits.',
      type: 'string',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'prepTime',
      title: 'Prep time',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'cookTime',
      title: 'Cook time',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'keywords',
      title: 'Search keywords',
      description: 'Optional extra terms to help people find this recipe.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.unique().max(10),
    }),
    defineField({
      name: 'introContent',
      title: 'Intro content',
      description: 'Rich text shown above the ingredients and method. Images and pull quotes can be inserted here.',
      type: 'array',
      of: articleContentMembers,
    }),
    defineField({
      name: 'ingredientSections',
      title: 'Ingredient sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'ingredientSection',
          title: 'Ingredient section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section title',
              type: 'string',
              validation: (rule) => rule.max(80),
            }),
            defineField({
              name: 'items',
              title: 'Ingredients',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'ingredientItem',
                  title: 'Ingredient',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'ingredient',
                      title: 'Ingredient line',
                      type: 'string',
                      validation: (rule) => rule.required().max(220),
                    }),
                    defineField({
                      name: 'note',
                      title: 'Extra note',
                      description: 'Optional extra context, shown in lighter italic text.',
                      type: 'string',
                      validation: (rule) => rule.max(180),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'ingredient',
                      subtitle: 'note',
                    },
                  },
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items',
            },
            prepare({items, title}) {
              const ingredientCount = Array.isArray(items) ? items.length : 0

              return {
                title: title || 'Ingredients',
                subtitle: `${ingredientCount} ingredient${ingredientCount === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'instructionSections',
      title: 'Instruction sections',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'instructionSection',
          title: 'Instruction section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section title',
              type: 'string',
              validation: (rule) => rule.max(80),
            }),
            defineField({
              name: 'steps',
              title: 'Steps',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'instructionStep',
                  title: 'Step',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'instruction',
                      title: 'Instruction',
                      type: 'text',
                      rows: 4,
                      validation: (rule) => rule.required().max(420),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'instruction',
                    },
                  },
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              steps: 'steps',
            },
            prepare({steps, title}) {
              const stepCount = Array.isArray(steps) ? steps.length : 0

              return {
                title: title || 'Method',
                subtitle: `${stepCount} step${stepCount === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'recipeNotes',
      title: 'Recipe notes',
      description: 'Optional notes shown near the bottom of the recipe page.',
      type: 'array',
      of: articleContentMembers,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      difficulty: 'difficulty',
      servings: 'servings',
      media: 'heroImage',
    },
    prepare({category, difficulty, media, servings, title}) {
      return {
        title,
        subtitle: [getRecipeCategoryTitle(category), difficulty ? getRecipeDifficultyTitle(difficulty) : null, servings || null]
          .filter(Boolean)
          .join(' - '),
        media,
      }
    },
  },
})
