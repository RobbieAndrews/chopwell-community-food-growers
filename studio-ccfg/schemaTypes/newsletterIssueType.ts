import {defineArrayMember, defineField, defineType} from 'sanity'
import {articleContentMembers} from './articleContent'

export const newsletterIssueType = defineType({
  name: 'newsletterIssue',
  title: 'Newsletter issue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Used in the newsletter archive cards and summaries.',
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
      name: 'topics',
      title: 'Topics',
      description: 'Short tags to highlight what this issue covers.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'leadStoryTitle',
      title: 'Lead story title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'leadStoryIntro',
      title: 'Lead story intro',
      description: 'A short standfirst introducing the main story.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'content',
      title: 'Story content',
      description: 'Write the story body here. Images and pull quotes can be added anywhere in the flow.',
      type: 'array',
      of: articleContentMembers,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'heroImage',
    },
    prepare({media, subtitle, title}) {
      const formattedSubtitle = subtitle
        ? new Date(subtitle).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Draft issue'

      return {
        title,
        subtitle: formattedSubtitle,
        media,
      }
    },
  },
})
