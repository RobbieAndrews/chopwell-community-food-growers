import {defineField, defineType} from 'sanity'
import {getProjectIconTitle, projectIconOptions, ProjectIconInput} from './projectIcons'

export const volunteerOpportunityType = defineType({
  name: 'volunteerOpportunity',
  title: 'Volunteer Opportunity',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Pick an icon for the opportunity. Hover an option to see its name.',
      type: 'string',
      initialValue: 'users',
      options: {
        list: projectIconOptions.map(({title, value}) => ({title, value})),
      },
      components: {
        input: ProjectIconInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'timeCommitment',
      title: 'Time commitment',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description:
        "Use this for the role overview, what they'll do, what they'll need, and any other key details.",
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      timeCommitment: 'timeCommitment',
      icon: 'icon',
    },
    prepare({icon, timeCommitment, title}) {
      const iconLabel = getProjectIconTitle(icon)
      const parts = [timeCommitment, `${iconLabel} icon`].filter(Boolean)

      return {
        title,
        subtitle: parts.join(' - '),
      }
    },
  },
})
