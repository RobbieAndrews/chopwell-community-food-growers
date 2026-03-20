export type ProjectIcon = 'leaf' | 'house' | 'utensils';

export interface Project {
	slug: string;
	title: string;
	description: string;
	imageUrl: string;
	icon: ProjectIcon;
	intro: string;
	details: string[];
	highlights: string[];
}

export const projects: Project[] = [
	{
		slug: 'community-allotment',
		title: 'Community Allotment',
		description:
			'Our main growing space brings people together to plant, learn, and share the harvest across the seasons.',
		imageUrl:
			'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
		icon: 'leaf',
		intro:
			'The community allotment is the practical heart of the group, offering shared growing space, regular working sessions, and room for people to learn by doing.',
		details: [
			'This project centres on growing food together in a shared outdoor space that can welcome both regular volunteers and first-time growers.',
			'Over time, this page can hold richer information from your CMS such as seasonal updates, plot availability, project goals, photo galleries, and practical visitor information.',
		],
		highlights: ['Shared growing space', 'Hands-on learning', 'Community work days'],
	},
	{
		slug: 'backyard-project',
		title: 'Backyard Project',
		description:
			'Helping residents turn patios, yards, and tucked-away corners into productive growing spaces.',
		imageUrl:
			'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
		icon: 'house',
		intro:
			'The Backyard Project supports people who want to grow food at home, no matter how small or unconventional the space might be.',
		details: [
			'This project is ideal for sharing guidance, examples, and support offers for residents who want to start growing at home.',
			'When your CMS is in place, this page could include success stories, downloadable guides, sign-up links, or case studies from local gardens.',
		],
		highlights: ['Home growing advice', 'Small-space ideas', 'Peer support'],
	},
	{
		slug: 'preserving-and-recipes',
		title: 'Preserving & Recipes',
		description:
			'Traditional preserving skills, shared recipes, and practical workshops for making the most of every crop.',
		imageUrl:
			'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80',
		icon: 'utensils',
		intro:
			'This project celebrates the knowledge that turns a harvest into meals, preserves, shared recipes, and seasonal workshops.',
		details: [
			'It is a good place to publish workshop details, recipe collections, and community know-how around storing and using seasonal produce.',
			'Later on, your CMS could power categories, related recipes, workshop dates, downloadable resources, and contributor stories.',
		],
		highlights: ['Seasonal preserving', 'Recipe sharing', 'Workshop ideas'],
	},
];
