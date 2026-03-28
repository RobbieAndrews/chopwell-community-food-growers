import {defineArrayMember, defineField} from 'sanity'

export const articleContentMembers = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Paragraph', value: 'normal'},
      {title: 'Heading 2', value: 'h2'},
      {title: 'Heading 3', value: 'h3'},
      {title: 'Quote', value: 'blockquote'},
    ],
    lists: [
      {title: 'Bulleted list', value: 'bullet'},
      {title: 'Numbered list', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.uri({
                  allowRelative: false,
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({
    name: 'newsletterBodyImage',
    title: 'Body image',
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
      }),
    ],
  }),
  defineArrayMember({
    name: 'newsletterCallout',
    title: 'Pull quote',
    type: 'object',
    fields: [
      defineField({
        name: 'quote',
        title: 'Quote',
        type: 'text',
        rows: 3,
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'attribution',
        title: 'Attribution',
        type: 'string',
      }),
    ],
    preview: {
      select: {
        quote: 'quote',
        attribution: 'attribution',
      },
      prepare({quote, attribution}) {
        return {
          title: quote,
          subtitle: attribution ? `Pull quote - ${attribution}` : 'Pull quote',
        }
      },
    },
  }),
]
