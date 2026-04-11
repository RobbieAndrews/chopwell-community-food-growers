import type {ResponsiveImageData, SanityImageWithAlt, SanitySlug} from './sanity'
import type {ArticlePortableTextBlock} from './articlePortableText'
import {
  getGrowingGuideCategoryTitle,
  getGrowingGuideDifficultyTitle,
  getGrowingGuideSeasonTitle,
  growingGuideCategoryOptions,
  growingGuideDifficultyOptions,
  growingGuideSeasonOptions,
  type GrowingGuideCategory,
  type GrowingGuideDifficulty,
  type GrowingGuideSeason,
} from '../../shared/growingGuides'

export {
  getGrowingGuideCategoryTitle,
  getGrowingGuideDifficultyTitle,
  getGrowingGuideSeasonTitle,
  growingGuideCategoryOptions,
  growingGuideDifficultyOptions,
  growingGuideSeasonOptions,
}

export interface GrowingGuideQuickFacts {
  sowIndoors?: string
  sowOutdoors?: string
  plantOut?: string
  harvest?: string
  sun?: string
  watering?: string
  spacing?: string
}

export interface GrowingGuideStep {
  _key?: string
  title: string
  description: string
}

export interface GrowingGuideProblem {
  _key?: string
  problem: string
  solution: string
}

export interface GrowingGuideSummary {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  category: GrowingGuideCategory
  seasons: GrowingGuideSeason[]
  difficulty?: GrowingGuideDifficulty
  keywords?: string[]
  heroImage?: SanityImageWithAlt
}

export interface GrowingGuidePage extends GrowingGuideSummary {
  quickFacts?: GrowingGuideQuickFacts
  steps?: GrowingGuideStep[]
  commonProblems?: GrowingGuideProblem[]
  body?: ArticlePortableTextBlock[]
}

export interface GrowingGuideBrowserCard extends GrowingGuideSummary {
  categoryLabel: string
  difficultyLabel?: string
  seasonLabels: string[]
  image: ResponsiveImageData | null
}

export const growingGuideFactLabels: Record<keyof GrowingGuideQuickFacts, string> = {
  sowIndoors: 'Sow indoors',
  sowOutdoors: 'Sow outdoors',
  plantOut: 'Plant out',
  harvest: 'Harvest',
  sun: 'Sun',
  watering: 'Watering',
  spacing: 'Spacing',
}
