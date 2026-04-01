import {defineArrayMember, defineField, defineType} from 'sanity'
import {articleContentMembers} from './articleContent'
import {
  getGrowingGuideCategoryTitle,
  getGrowingGuideDifficultyTitle,
  getGrowingGuideSeasonTitle,
  growingGuideCategoryOptions,
  growingGuideDifficultyOptions,
  growingGuideSeasonOptions,
} from '../../shared/growingGuides'

export const growingGuideType = defineType({
  name: 'growingGuide',
  title: 'Growing guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Crop name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
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
      description: 'Shown on guide cards and at the top of the guide page.',
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
        list: growingGuideCategoryOptions.map(({title, value}) => ({title, value})),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seasons',
      title: 'Best seasons',
      description: 'Use these to help visitors filter guides by the time of year.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: growingGuideSeasonOptions.map(({title, value}) => ({title, value})),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: growingGuideDifficultyOptions.map(({title, value}) => ({title, value})),
      },
    }),
    defineField({
      name: 'keywords',
      title: 'Search keywords',
      description: 'Optional extra terms to help people find this guide.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.unique().max(10),
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick facts',
      type: 'object',
      fields: [
        defineField({name: 'sowIndoors', title: 'Sow indoors', type: 'string'}),
        defineField({name: 'sowOutdoors', title: 'Sow outdoors', type: 'string'}),
        defineField({name: 'plantOut', title: 'Plant out', type: 'string'}),
        defineField({name: 'harvest', title: 'Harvest', type: 'string'}),
        defineField({name: 'sun', title: 'Sun', type: 'string'}),
        defineField({name: 'watering', title: 'Watering', type: 'string'}),
        defineField({name: 'spacing', title: 'Spacing', type: 'string'}),
      ],
    }),
    defineField({
      name: 'steps',
      title: 'Growing steps',
      description: 'Short step-by-step practical guidance.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step title',
              type: 'string',
              validation: (rule) => rule.required().max(90),
            }),
            defineField({
              name: 'description',
              title: 'Step description',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().max(320),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'commonProblems',
      title: 'Common problems',
      description: 'Troubleshooting tips for common issues.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'problem',
              title: 'Problem',
              type: 'string',
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: 'solution',
              title: 'What to do',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().max(320),
            }),
          ],
          preview: {
            select: {
              title: 'problem',
              subtitle: 'solution',
            },
          },
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'body',
      title: 'Guide content',
      description: 'Optional richer content for deeper growing advice.',
      type: 'array',
      of: articleContentMembers,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      difficulty: 'difficulty',
      seasons: 'seasons',
      media: 'heroImage',
    },
    prepare({category, difficulty, media, seasons, title}) {
      const seasonSummary = Array.isArray(seasons)
        ? seasons.map((season) => getGrowingGuideSeasonTitle(season)).join(', ')
        : ''

      return {
        title,
        subtitle: [
          getGrowingGuideCategoryTitle(category),
          difficulty ? getGrowingGuideDifficultyTitle(difficulty) : null,
          seasonSummary || null,
        ]
          .filter(Boolean)
          .join(' - '),
        media,
      }
    },
  },
})
