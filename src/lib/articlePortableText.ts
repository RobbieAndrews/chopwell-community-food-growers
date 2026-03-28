import type { TypedObject } from 'astro-portabletext/types';
import NewsletterBlockquote from '../components/newsletter/NewsletterBlockquote.astro';
import NewsletterBodyImage from '../components/newsletter/NewsletterBodyImage.astro';
import NewsletterBulletList from '../components/newsletter/NewsletterBulletList.astro';
import NewsletterCallout from '../components/newsletter/NewsletterCallout.astro';
import NewsletterHeadingThree from '../components/newsletter/NewsletterHeadingThree.astro';
import NewsletterHeadingTwo from '../components/newsletter/NewsletterHeadingTwo.astro';
import NewsletterListItem from '../components/newsletter/NewsletterListItem.astro';
import NewsletterNumberList from '../components/newsletter/NewsletterNumberList.astro';
import NewsletterParagraph from '../components/newsletter/NewsletterParagraph.astro';

export interface ArticleCalloutBlock extends TypedObject {
	_type: 'newsletterCallout';
	quote: string;
	attribution?: string;
}

export type ArticlePortableTextBlock = TypedObject | ArticleCalloutBlock;

export const articlePortableTextComponents = {
	type: {
		newsletterBodyImage: NewsletterBodyImage,
		newsletterCallout: NewsletterCallout,
	},
	block: {
		normal: NewsletterParagraph,
		h2: NewsletterHeadingTwo,
		h3: NewsletterHeadingThree,
		blockquote: NewsletterBlockquote,
	},
	list: {
		bullet: NewsletterBulletList,
		number: NewsletterNumberList,
	},
	listItem: {
		bullet: NewsletterListItem,
		number: NewsletterListItem,
	},
};
