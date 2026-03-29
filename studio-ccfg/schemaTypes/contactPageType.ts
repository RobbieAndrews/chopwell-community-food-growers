import {defineArrayMember, defineField, defineType} from 'sanity'

const socialPlatformOptions = [
  {title: 'Facebook', value: 'facebook'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'X / Twitter', value: 'x'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'TikTok', value: 'tiktok'},
  {title: 'Bluesky', value: 'bluesky'},
  {title: 'Website', value: 'website'},
  {title: 'Other', value: 'other'},
] as const

function getSocialPlatformTitle(value?: string) {
  return socialPlatformOptions.find((option) => option.value === value)?.title ?? 'Social link'
}

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'emailAddress',
      title: 'Email address',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone number',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'phoneAvailability',
      title: 'Phone availability',
      description: 'Optional extra line shown below the phone number.',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'location',
      title: 'Address / location',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'accessHours',
      title: 'Access hours',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'accessHour',
          title: 'Access hour',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Day / label',
              type: 'string',
              validation: (rule) => rule.required().max(60),
            }),
            defineField({
              name: 'hours',
              title: 'Hours',
              type: 'string',
              validation: (rule) => rule.required().max(60),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'hours',
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      description: 'Platform is stored separately so these can be upgraded to real icons later.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'socialLink',
          title: 'Social link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: socialPlatformOptions.map(({title, value}) => ({title, value})),
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label override',
              description: 'Optional custom label if you want something different from the platform name.',
              type: 'string',
              validation: (rule) => rule.max(40),
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
          ],
          preview: {
            select: {
              platform: 'platform',
              label: 'label',
              subtitle: 'url',
            },
            prepare({label, platform, subtitle}) {
              return {
                title: label || getSocialPlatformTitle(platform),
                subtitle,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'faqItem',
          title: 'FAQ item',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().max(320),
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      emailAddress: 'emailAddress',
      faqItems: 'faqItems',
    },
    prepare({emailAddress, faqItems}) {
      const faqCount = Array.isArray(faqItems) ? faqItems.length : 0

      return {
        title: 'Contact Page',
        subtitle: `${emailAddress ?? 'No email set'} - ${faqCount} FAQ item${faqCount === 1 ? '' : 's'}`,
      }
    },
  },
})
