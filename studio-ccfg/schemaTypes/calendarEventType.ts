import {defineArrayMember, defineField, defineType} from 'sanity'
import {articleContentMembers} from './articleContent'

const categoryOptions = [
  {title: 'Workshop', value: 'Workshop'},
  {title: 'Volunteer', value: 'Volunteer'},
  {title: 'Community', value: 'Community'},
  {title: 'Maintenance', value: 'Maintenance'},
]

const eventTypeOptions = [
  {title: 'Standard event', value: 'standard'},
  {title: 'Competition event', value: 'competition'},
]

export const calendarEventType = defineType({
  name: 'calendarEvent',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event type',
      type: 'string',
      options: {
        list: eventTypeOptions,
        layout: 'radio',
      },
      initialValue: 'standard',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start time',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
          name: '24-hour time',
          invert: false,
        }),
    }),
    defineField({
      name: 'endTime',
      title: 'End time',
      type: 'string',
      validation: (rule) =>
        rule.required().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
          name: '24-hour time',
          invert: false,
        }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: categoryOptions,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'body',
      title: 'Event details',
      description: 'Rich detail content for the event page. Images and pull quotes can be inserted here.',
      type: 'array',
      of: articleContentMembers,
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
    }),
    defineField({
      name: 'winnerCategories',
      title: 'Winner categories',
      description: 'Only used for competition events.',
      type: 'array',
      hidden: ({document}) => document?.eventType !== 'competition',
      of: [
        defineArrayMember({
          name: 'winnerCategory',
          title: 'Winner category',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Category title',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'winners',
              title: 'Winners',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'winner',
                  title: 'Winner',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Winner name',
                      type: 'string',
                      validation: (rule) => rule.required().max(120),
                    }),
                    defineField({
                      name: 'details',
                      title: 'Supporting details',
                      description: 'Optional context such as placing, entry title, or notes.',
                      type: 'string',
                      validation: (rule) => rule.max(180),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'name',
                      subtitle: 'details',
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
              winners: 'winners',
            },
            prepare({title, winners}) {
              const winnerCount = Array.isArray(winners) ? winners.length : 0

              return {
                title: title || 'Winner category',
                subtitle: `${winnerCount} winner${winnerCount === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      description: 'Optional post-event images shown after the event is finished.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'galleryImage',
          title: 'Gallery image',
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
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (rule) => rule.max(180),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      startTime: 'startTime',
      category: 'category',
      eventType: 'eventType',
      media: 'heroImage',
    },
    prepare({title, date, startTime, category, eventType, media}) {
      const selectedEventType = eventTypeOptions.find((option) => option.value === eventType)?.title
      const parts = [date, startTime, category, selectedEventType].filter(Boolean)

      return {
        title,
        subtitle: parts.join(' - '),
        media,
      }
    },
  },
})
