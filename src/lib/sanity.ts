import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {sanityClient} from 'sanity:client'

export interface SanitySlug {
	current: string
}

export type SanityImageWithAlt = SanityImageSource & {
	alt?: string
}

export interface SanityImageDimensions {
	width: number
	height: number
	aspectRatio: number
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

function getImageAssetRef(source: SanityImageSource) {
	if (!source || typeof source !== 'object') return null

	const asset = 'asset' in source ? source.asset : null

	if (!asset || typeof asset !== 'object') return null

	if ('_ref' in asset && typeof asset._ref === 'string') return asset._ref
	if ('_id' in asset && typeof asset._id === 'string') return asset._id

	return null
}

export function getSanityImageDimensions(source: SanityImageSource): SanityImageDimensions | null {
	const assetRef = getImageAssetRef(source)

	if (!assetRef) return null

	const match = assetRef.match(/image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i)

	if (!match) return null

	const width = Number.parseInt(match[1], 10)
	const height = Number.parseInt(match[2], 10)

	if (!width || !height) return null

	return {
		width,
		height,
		aspectRatio: width / height,
	}
}

interface SanityImageUrlOptions {
	width?: number
	height?: number
	aspectRatio?: number
	fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'min' | 'scale'
	quality?: number
}

export function getSanityImageUrl(source: SanityImageSource, options: SanityImageUrlOptions = {}) {
	const image = urlForImage(source)?.auto('format')

	if (!image) return null

	if (options.width) image.width(options.width)
	if (options.height) {
		image.height(options.height)
	} else if (options.width && options.aspectRatio) {
		image.height(Math.round(options.width / options.aspectRatio))
	}
	if (options.fit) image.fit(options.fit)
	if (options.quality) image.quality(options.quality)

	return image.url()
}

export function getSanityImageSrcSet(
	source: SanityImageSource,
	widths: number[],
	options: Omit<SanityImageUrlOptions, 'width'> = {},
) {
	const dimensions = getSanityImageDimensions(source)
	const cappedWidths = dimensions
		? widths.filter((width) => width <= dimensions.width)
		: widths
	const uniqueWidths = [...new Set(cappedWidths)]
	const finalWidths =
		dimensions && !uniqueWidths.includes(dimensions.width)
			? [...uniqueWidths, dimensions.width]
			: uniqueWidths

	return finalWidths
		.map((width) => {
			const url = getSanityImageUrl(source, {
				...options,
				width,
			})

			return url ? `${url} ${width}w` : null
		})
		.filter((entry): entry is string => Boolean(entry))
		.join(', ')
}
