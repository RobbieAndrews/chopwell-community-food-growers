import {defineField, defineType} from 'sanity'

const categoryOptions = [
  {title: 'Workshop', value: 'Workshop'},
  {title: 'Volunteer', value: 'Volunteer'},
  {title: 'Community', value: 'Community'},
  {title: 'Maintenance', value: 'Maintenance'},
]

export const calendarEventType = defineType({
  name: 'calendarEvent',
  title: 'Calendar Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(280),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      startTime: 'startTime',
      category: 'category',
    },
    prepare({title, date, startTime, category}) {
      const parts = [date, startTime, category].filter(Boolean)

      return {
        title,
        subtitle: parts.join(' - '),
      }
    },
  },
})
