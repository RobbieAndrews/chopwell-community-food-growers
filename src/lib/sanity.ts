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

export interface ResponsiveImageData {
	src: string
	srcSet?: string
	sizes?: string
	width?: number
	height?: number
	alt: string
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

export type SanityImageFit = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'min' | 'scale'

export interface SanityImageUrlOptions {
	width?: number
	height?: number
	aspectRatio?: number
	fit?: SanityImageFit
	quality?: number
}

export interface ResponsiveSanityImageOptions extends SanityImageUrlOptions {
	widths?: number[]
	sizes?: string
	alt?: string
	altFallback?: string
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

function getCappedImageWidth(source: SanityImageSource, width?: number) {
	if (!width) return undefined

	const dimensions = getSanityImageDimensions(source)

	return dimensions ? Math.min(width, dimensions.width) : width
}

function getSanityImageRenderDimensions(
	source: SanityImageSource,
	options: SanityImageUrlOptions,
) {
	const dimensions = getSanityImageDimensions(source)
	const width = getCappedImageWidth(source, options.width) ?? dimensions?.width

	if (!width) {
		return {
			width: dimensions?.width,
			height: dimensions?.height,
		}
	}

	if (options.height) {
		return {
			width,
			height: options.height,
		}
	}

	if (options.aspectRatio) {
		return {
			width,
			height: Math.round(width / options.aspectRatio),
		}
	}

	if (dimensions) {
		return {
			width,
			height: Math.round(width / dimensions.aspectRatio),
		}
	}

	return {
		width,
		height: undefined,
	}
}

export function getSanityResponsiveImageData(
	source: SanityImageSource,
	options: ResponsiveSanityImageOptions = {},
): ResponsiveImageData | null {
	const requestedWidth = options.width ?? options.widths?.[options.widths.length - 1]
	const width = getCappedImageWidth(source, requestedWidth)
	const src = getSanityImageUrl(source, {
		...options,
		width,
	})

	if (!src) return null

	const {width: renderWidth, height: renderHeight} = getSanityImageRenderDimensions(source, {
		...options,
		width,
	})
	const srcSet =
		options.widths?.length
			? getSanityImageSrcSet(source, options.widths, options)
			: ''
	const altFromSource =
		typeof source === 'object' &&
		source &&
		'alt' in source &&
		typeof source.alt === 'string'
			? source.alt
			: ''

	return {
		src,
		srcSet: srcSet || undefined,
		sizes: options.sizes,
		width: renderWidth,
		height: renderHeight,
		alt: options.alt ?? (altFromSource || options.altFallback || ''),
	}
}
