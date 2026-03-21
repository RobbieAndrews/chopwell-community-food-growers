import {defineField, defineType} from 'sanity'
import {getProjectIconTitle, projectIconOptions, ProjectIconInput} from './projectIcons'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Short description',
      description: 'Shown under the project name on the projects page.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'icon',
      title: 'Project icon',
      description: 'Pick an icon for the project. Hover an option to see its name.',
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
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
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
      name: 'body',
      title: 'Project content',
      description: 'Optional richer content for the individual project page.',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'headline',
      media: 'mainImage',
      icon: 'icon',
    },
    prepare({icon, media, subtitle, title}) {
      const iconLabel = getProjectIconTitle(icon)

      return {
        title,
        subtitle: subtitle ? `${iconLabel} icon - ${subtitle}` : `${iconLabel} icon`,
        media,
      }
    },
  },
})
