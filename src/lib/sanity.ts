import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {sanityClient} from 'sanity:client'

export interface SanitySlug {
	current: string
}

export type SanityImageWithAlt = SanityImageSource & {
	alt?: string
}

const { dataset, projectId } = sanityClient.config()

const imageBuilder =
	projectId && dataset
		? createImageUrlBuilder({
				projectId,
				dataset,
			})
		: null

export function urlForImage(source: SanityImageSource) {
	return imageBuilder?.image(source) ?? null
}
