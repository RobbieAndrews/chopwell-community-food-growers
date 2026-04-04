import {defineArrayMember, defineField, defineType} from 'sanity'
import {getProjectIconTitle, projectIconOptions} from './projectIcons'

const galleryLayoutVariants = [
  {title: 'Tall', value: 'tall'},
  {title: 'Standard', value: 'standard'},
  {title: 'Wide', value: 'wide'},
] as const

function homepageImageField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        validation: (rule) => rule.required().max(180),
      }),
    ],
  })
}

const ctaFields = [
  defineField({
    name: 'label',
    title: 'Label',
    type: 'string',
    validation: (rule) => rule.required().max(60),
  }),
  defineField({
    name: 'href',
    title: 'Link',
    type: 'string',
    validation: (rule) => rule.required().max(120),
  }),
]

export const homePageType = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'A greener, warmer community hub built around growing.',
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 4,
          initialValue:
            'Chopwell Community Food Growers brings people together through shared allotments, practical learning, and the simple pleasure of food grown close to home.',
          validation: (rule) => rule.required().max(320),
        }),
        defineField({
          name: 'primaryCta',
          title: 'Primary CTA',
          type: 'object',
          fields: ctaFields,
          initialValue: {
            label: 'Get involved',
            href: '/get-involved',
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Secondary CTA',
          type: 'object',
          fields: ctaFields,
          initialValue: {
            label: 'View projects',
            href: '/projects',
          },
          validation: (rule) => rule.required(),
        }),
        homepageImageField('primaryImage', 'Primary image'),
        homepageImageField('secondaryImage', 'Secondary image'),
        homepageImageField('tertiaryImage', 'Tertiary image'),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pathwaysSection',
      title: 'Pathways section',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          initialValue: 'What you can step into',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'A homepage that feels active, welcoming, and full of life.',
          validation: (rule) => rule.required().max(140),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue:
            'Instead of flat feature cards, these pathways use photography and stronger contrast to make the group feel real before someone ever clicks through.',
          validation: (rule) => rule.required().max(320),
        }),
        defineField({
          name: 'items',
          title: 'Pathways',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'pathway',
              title: 'Pathway',
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (rule) => rule.required().max(80),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                  validation: (rule) => rule.required().max(220),
                }),
                defineField({
                  name: 'href',
                  title: 'Link',
                  type: 'string',
                  validation: (rule) => rule.required().max(120),
                }),
                defineField({
                  name: 'linkLabel',
                  title: 'Link label',
                  type: 'string',
                  validation: (rule) => rule.required().max(60),
                }),
                homepageImageField('image', 'Image'),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  initialValue: 'sprout',
                  options: {
                    list: projectIconOptions
                      .filter((option) => ['sprout', 'calendar', 'leaf'].includes(option.value))
                      .map(({title, value}) => ({title, value})),
                  },
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'href',
                  media: 'image',
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
            }),
          ],
          validation: (rule) => rule.required().min(3).max(3),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seasonalSection',
      title: 'Seasonal section',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          initialValue: 'The rhythm of the year',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'A more editorial section that gives the homepage some identity.',
          validation: (rule) => rule.required().max(140),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 4,
          initialValue:
            'This block breaks up the page with a calmer layout: one strong image, one clear story, and a sense of seasonal progression rather than another row of generic cards.',
          validation: (rule) => rule.required().max(320),
        }),
        homepageImageField('featureImage', 'Feature image'),
        defineField({
          name: 'calloutLabel',
          title: 'Callout label',
          type: 'string',
          initialValue: 'Community-led and hands-on',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'calloutCopy',
          title: 'Callout copy',
          type: 'text',
          rows: 3,
          initialValue:
            'The strongest part of the group is that people learn by being in it, rather than watching from the sidelines.',
          validation: (rule) => rule.required().max(220),
        }),
        defineField({
          name: 'moments',
          title: 'Seasonal moments',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'seasonalMoment',
              title: 'Seasonal moment',
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (rule) => rule.required().max(80),
                }),
                defineField({
                  name: 'copy',
                  title: 'Copy',
                  type: 'text',
                  rows: 3,
                  validation: (rule) => rule.required().max(220),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'copy',
                },
              },
            }),
          ],
          validation: (rule) => rule.required().min(3).max(3),
        }),
        defineField({
          name: 'primaryCta',
          title: 'Primary CTA',
          type: 'object',
          fields: ctaFields,
          initialValue: {
            label: 'See upcoming events',
            href: '/calendar',
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Secondary CTA',
          type: 'object',
          fields: ctaFields,
          initialValue: {
            label: 'Contact the group',
            href: '/contact',
          },
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallerySection',
      title: 'Gallery section',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          initialValue: 'Life in the gardens',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'More imagery, but used with purpose.',
          validation: (rule) => rule.required().max(140),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue:
            'The client wants pictures, so this gallery turns them into a proper storytelling device rather than decorative filler.',
          validation: (rule) => rule.required().max(320),
        }),
        defineField({
          name: 'items',
          title: 'Gallery items',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'galleryItem',
              title: 'Gallery item',
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (rule) => rule.required().max(80),
                }),
                homepageImageField('image', 'Image'),
                defineField({
                  name: 'layoutVariant',
                  title: 'Layout variant',
                  type: 'string',
                  initialValue: 'standard',
                  options: {
                    list: galleryLayoutVariants.map(({title, value}) => ({title, value})),
                  },
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'layoutVariant',
                  media: 'image',
                },
                prepare({media, subtitle, title}) {
                  const layoutTitle =
                    galleryLayoutVariants.find((variant) => variant.value === subtitle)?.title ??
                    'Layout'

                  return {
                    title,
                    subtitle: layoutTitle,
                    media,
                  }
                },
              },
            }),
          ],
          validation: (rule) => rule.required().min(4).max(4),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'finalCtaSection',
      title: 'Final CTA section',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          initialValue: 'Ready to join in?',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Make the homepage feel like the community is already in motion.',
          validation: (rule) => rule.required().max(140),
        }),
        defineField({
          name: 'body',
          title: 'Body copy',
          type: 'text',
          rows: 4,
          initialValue:
            'If you want, I can carry the same visual direction through the other key pages next so the site feels consistently modern instead of just having one standout homepage.',
          validation: (rule) => rule.required().max(320),
        }),
        homepageImageField('backgroundImage', 'Background image'),
        defineField({
          name: 'primaryCta',
          title: 'Primary CTA',
          type: 'object',
          fields: ctaFields,
          initialValue: {
            label: 'Start here',
            href: '/get-involved',
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Secondary CTA',
          type: 'object',
          fields: ctaFields,
          initialValue: {
            label: 'Contact us',
            href: '/contact',
          },
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'hero.heading',
      pathways: 'pathwaysSection.items',
      galleryItems: 'gallerySection.items',
    },
    prepare({galleryItems, pathways, title}) {
      const pathwayCount = Array.isArray(pathways) ? pathways.length : 0
      const galleryCount = Array.isArray(galleryItems) ? galleryItems.length : 0

      return {
        title: 'Homepage',
        subtitle: `${title ?? 'No hero heading set'} - ${pathwayCount} pathways - ${galleryCount} gallery items`,
      }
    },
  },
})
