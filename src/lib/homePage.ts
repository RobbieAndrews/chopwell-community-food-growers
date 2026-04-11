import { sanityClient } from "sanity:client";
import type { SanityImageWithAlt } from "./sanity";

export type GalleryLayoutVariant = "standard" | "tall" | "wide";

interface HomePageLink {
    label?: string;
    href?: string;
}

interface HomePagePathwayItem {
    _key?: string;
    title?: string;
    description?: string;
    href?: string;
    linkLabel?: string;
    image?: SanityImageWithAlt;
}

interface HomePageSeasonalMoment {
    _key?: string;
    title?: string;
    copy?: string;
}

interface HomePageGalleryItem {
    _key?: string;
    title?: string;
    image?: SanityImageWithAlt;
    layoutVariant?: GalleryLayoutVariant;
}

interface HomePageDocument {
    hero?: {
        heading?: string;
        intro?: string;
        primaryCta?: HomePageLink;
        secondaryCta?: HomePageLink;
        primaryImage?: SanityImageWithAlt;
        secondaryImage?: SanityImageWithAlt;
        tertiaryImage?: SanityImageWithAlt;
    };
    pathwaysSection?: {
        eyebrow?: string;
        heading?: string;
        intro?: string;
        items?: HomePagePathwayItem[];
    };
    seasonalSection?: {
        eyebrow?: string;
        heading?: string;
        intro?: string;
        featureImage?: SanityImageWithAlt;
        calloutLabel?: string;
        calloutCopy?: string;
        moments?: HomePageSeasonalMoment[];
        primaryCta?: HomePageLink;
        secondaryCta?: HomePageLink;
    };
    gallerySection?: {
        eyebrow?: string;
        heading?: string;
        intro?: string;
        items?: HomePageGalleryItem[];
    };
    finalCtaSection?: {
        eyebrow?: string;
        heading?: string;
        body?: string;
        backgroundImage?: SanityImageWithAlt;
        primaryCta?: HomePageLink;
        secondaryCta?: HomePageLink;
    };
}

export type HomePageImage = SanityImageWithAlt;

export interface HomePageLinkData {
    label: string;
    href: string;
}

export interface HomeHeroSection {
    heading?: string;
    intro?: string;
    primaryCta: HomePageLinkData | null;
    secondaryCta: HomePageLinkData | null;
    primaryImage: HomePageImage | null;
    secondaryImage: HomePageImage | null;
    tertiaryImage: HomePageImage | null;
}

export interface HomePathwayCard {
    title: string;
    description: string;
    href: string;
    linkLabel: string;
    image: HomePageImage | null;
}

export interface HomePathwaysSection {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items: HomePathwayCard[];
}

export interface HomeSeasonalMomentData {
    title: string;
    copy: string;
}

export interface HomeSeasonalSection {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    featureImage: HomePageImage | null;
    calloutLabel?: string;
    calloutCopy?: string;
    moments: HomeSeasonalMomentData[];
    primaryCta: HomePageLinkData | null;
    secondaryCta: HomePageLinkData | null;
}

export interface HomeGalleryItemData {
    title: string;
    image: HomePageImage;
    heightClass: string;
}

export interface HomeGallerySection {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    items: HomeGalleryItemData[];
}

export interface HomeFinalCtaSection {
    eyebrow?: string;
    heading?: string;
    body?: string;
    backgroundImage: HomePageImage | null;
    primaryCta: HomePageLinkData | null;
    secondaryCta: HomePageLinkData | null;
}

export interface HomePageData {
    heroSection: HomeHeroSection | null;
    pathwaysSection: HomePathwaysSection | null;
    seasonalSection: HomeSeasonalSection | null;
    gallerySection: HomeGallerySection | null;
    finalSection: HomeFinalCtaSection | null;
}

const galleryHeightClassMap: Record<GalleryLayoutVariant, string> = {
    tall: "md:row-span-2",
    standard: "",
    wide: "md:col-span-2",
};

const HOME_PAGE_QUERY = `*[
    _type == "homePage"
]|order(_updatedAt desc)[0]{
    hero{
        heading,
        intro,
        primaryCta{label, href},
        secondaryCta{label, href},
        primaryImage,
        secondaryImage,
        tertiaryImage
    },
    pathwaysSection{
        eyebrow,
        heading,
        intro,
        items[]{
            _key,
            title,
            description,
            href,
            linkLabel,
            image
        }
    },
    seasonalSection{
        eyebrow,
        heading,
        intro,
        featureImage,
        calloutLabel,
        calloutCopy,
        moments[]{
            _key,
            title,
            copy
        },
        primaryCta{label, href},
        secondaryCta{label, href}
    },
    gallerySection{
        eyebrow,
        heading,
        intro,
        items[]{
            _key,
            title,
            image,
            layoutVariant
        }
    },
    finalCtaSection{
        eyebrow,
        heading,
        body,
        backgroundImage,
        primaryCta{label, href},
        secondaryCta{label, href}
    }
}`;

function hasText(value: string | undefined) {
    return Boolean(value?.trim());
}

function isValidLink(
    link: HomePageLink | undefined,
): link is HomePageLinkData {
    return Boolean(link?.label && link?.href);
}

function getImageData(
    image: SanityImageWithAlt | undefined,
) {
    return image ?? null;
}

function mapHeroSection(homePage: HomePageDocument | null) {
    const hero = homePage?.hero;
    if (!hero) return null;

    const primaryImage = getImageData(hero.primaryImage);
    const secondaryImage = getImageData(hero.secondaryImage);
    const tertiaryImage = getImageData(hero.tertiaryImage);

    const section = {
        heading: hero.heading,
        intro: hero.intro,
        primaryCta: isValidLink(hero.primaryCta) ? hero.primaryCta : null,
        secondaryCta: isValidLink(hero.secondaryCta) ? hero.secondaryCta : null,
        primaryImage,
        secondaryImage,
        tertiaryImage,
    };

    return hasText(section.heading) ||
        hasText(section.intro) ||
        section.primaryCta ||
        section.secondaryCta ||
        section.primaryImage ||
        section.secondaryImage ||
        section.tertiaryImage
        ? section
        : null;
}

function mapPathwaysSection(homePage: HomePageDocument | null) {
    const section = homePage?.pathwaysSection;
    if (!section) return null;

    const items =
        section.items
            ?.filter(
                (item): item is Required<
                    Pick<
                        HomePagePathwayItem,
                        "title" | "description" | "href" | "linkLabel"
                    >
                > &
                    HomePagePathwayItem =>
                    Boolean(
                        item?.title &&
                            item?.description &&
                            item?.href &&
                            item?.linkLabel,
                    ),
            )
            .map((item) => {
                return {
                    title: item.title,
                    description: item.description,
                    href: item.href,
                    linkLabel: item.linkLabel,
                    image: getImageData(item.image),
                };
            }) ?? [];

    const mappedSection = {
        eyebrow: section.eyebrow,
        heading: section.heading,
        intro: section.intro,
        items,
    };

    return hasText(mappedSection.eyebrow) ||
        hasText(mappedSection.heading) ||
        hasText(mappedSection.intro) ||
        mappedSection.items.length > 0
        ? mappedSection
        : null;
}

function mapSeasonalSection(homePage: HomePageDocument | null) {
    const section = homePage?.seasonalSection;
    if (!section) return null;

    const featureImage = getImageData(section.featureImage);
    const moments =
        section.moments
            ?.filter(
                (item): item is Required<HomePageSeasonalMoment> =>
                    Boolean(item?.title && item?.copy),
            )
            .map((item) => ({
                title: item.title,
                copy: item.copy,
            })) ?? [];

    const mappedSection = {
        eyebrow: section.eyebrow,
        heading: section.heading,
        intro: section.intro,
        featureImage,
        calloutLabel: section.calloutLabel,
        calloutCopy: section.calloutCopy,
        moments,
        primaryCta: isValidLink(section.primaryCta) ? section.primaryCta : null,
        secondaryCta: isValidLink(section.secondaryCta)
            ? section.secondaryCta
            : null,
    };

    return hasText(mappedSection.eyebrow) ||
        hasText(mappedSection.heading) ||
        hasText(mappedSection.intro) ||
        hasText(mappedSection.calloutLabel) ||
        hasText(mappedSection.calloutCopy) ||
        mappedSection.primaryCta ||
        mappedSection.secondaryCta ||
        mappedSection.featureImage ||
        mappedSection.moments.length > 0
        ? mappedSection
        : null;
}

function mapGallerySection(homePage: HomePageDocument | null) {
    const section = homePage?.gallerySection;
    if (!section) return null;

    const items =
        section.items
            ?.filter(
                (item): item is Required<
                    Pick<HomePageGalleryItem, "title" | "layoutVariant" | "image">
                > &
                    HomePageGalleryItem =>
                    Boolean(
                        item?.title &&
                            item?.image?.alt &&
                            item?.layoutVariant &&
                            item.layoutVariant in galleryHeightClassMap,
                    ),
            )
            .map((item) => {
                const image = getImageData(item.image);

                if (!image) return null;

                return {
                    title: item.title,
                    image,
                    heightClass: galleryHeightClassMap[item.layoutVariant],
                };
            })
            .filter((item): item is HomeGalleryItemData => Boolean(item)) ?? [];

    const mappedSection = {
        eyebrow: section.eyebrow,
        heading: section.heading,
        intro: section.intro,
        items,
    };

    return hasText(mappedSection.eyebrow) ||
        hasText(mappedSection.heading) ||
        hasText(mappedSection.intro) ||
        mappedSection.items.length > 0
        ? mappedSection
        : null;
}

function mapFinalSection(homePage: HomePageDocument | null) {
    const section = homePage?.finalCtaSection;
    if (!section) return null;

    const backgroundImage = getImageData(section.backgroundImage);

    const mappedSection = {
        eyebrow: section.eyebrow,
        heading: section.heading,
        body: section.body,
        backgroundImage,
        primaryCta: isValidLink(section.primaryCta) ? section.primaryCta : null,
        secondaryCta: isValidLink(section.secondaryCta)
            ? section.secondaryCta
            : null,
    };

    return hasText(mappedSection.eyebrow) ||
        hasText(mappedSection.heading) ||
        hasText(mappedSection.body) ||
        mappedSection.primaryCta ||
        mappedSection.secondaryCta ||
        mappedSection.backgroundImage
        ? mappedSection
        : null;
}

export async function getHomePageData(): Promise<HomePageData> {
    const homePage = await sanityClient.fetch<HomePageDocument | null>(
        HOME_PAGE_QUERY,
    );

    return {
        heroSection: mapHeroSection(homePage),
        pathwaysSection: mapPathwaysSection(homePage),
        seasonalSection: mapSeasonalSection(homePage),
        gallerySection: mapGallerySection(homePage),
        finalSection: mapFinalSection(homePage),
    };
}
