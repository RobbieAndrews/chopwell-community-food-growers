import {defineArrayMember, defineField, defineType} from 'sanity'
import {getProjectIconTitle, projectIconOptions, ProjectIconInput} from './projectIcons'
import {
  getUsefulLinkSectionColorTitle,
  usefulLinkSectionColorOptions,
  UsefulLinkSectionColorInput,
} from './usefulLinkSectionColors'

export const usefulLinkSectionType = defineType({
  name: 'usefulLinkSection',
  title: 'Useful Link Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers appear first on the Useful Links page.',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'icon',
      title: 'Section icon',
      description: 'Pick a Lucide icon for this section.',
      type: 'string',
      initialValue: 'leaf',
      options: {
        list: projectIconOptions.map(({title, value}) => ({title, value})),
      },
      components: {
        input: ProjectIconInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Section color',
      description: 'Controls the colored icon badge used on the page.',
      type: 'string',
      initialValue: 'green',
      options: {
        list: usefulLinkSectionColorOptions.map(({title, value}) => ({title, value})),
      },
      components: {
        input: UsefulLinkSectionColorInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Link title',
              type: 'string',
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({
                  allowRelative: false,
                  scheme: ['http', 'https'],
                }),
            }),
            defineField({
              name: 'description',
              title: 'Short description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(180),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
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
      icon: 'icon',
      color: 'color',
      links: 'links',
      order: 'order',
    },
    prepare({color, icon, links, order, title}) {
      const iconLabel = getProjectIconTitle(icon)
      const linkCount = Array.isArray(links) ? links.length : 0
      const colorLabel = getUsefulLinkSectionColorTitle(color)

      return {
        title,
        subtitle: `#${order ?? 0} - ${iconLabel} icon - ${colorLabel} - ${linkCount} link${linkCount === 1 ? '' : 's'}`,
      }
    },
  },
})
