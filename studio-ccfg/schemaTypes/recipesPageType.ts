import {defineField, defineType} from 'sanity'
import {articleContentMembers} from './articleContent'

export const recipesPageType = defineType({
  name: 'recipesPage',
  title: 'Recipes Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Recipes',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Page description',
      type: 'text',
      rows: 3,
      initialValue:
        'A collection of community recipes for preserves, seasonal cooking, and making the most of what comes out of the garden.',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'introContent',
      title: 'Intro content',
      description: 'Optional rich text shown above the recipe listing.',
      type: 'array',
      of: articleContentMembers,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({description, title}) {
      return {
        title: title || 'Recipes',
        subtitle: description || 'No description set',
      }
    },
  },
})
