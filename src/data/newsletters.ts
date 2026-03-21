export interface Newsletter {
	slug: string;
	title: string;
	date: string;
	preview: string;
	topics: string[];
	intro: string;
	sections: {
		title: string;
		body: string;
	}[];
}

export const newsletters: Newsletter[] = [
	{
		slug: 'spring-edition-2026',
		title: 'Spring Edition 2026',
		date: 'March 2026',
		preview:
			'Spring is here. Read about new plot allocations, upcoming workshops, and seasonal growing tips.',
		topics: [
			'Plot Allocations',
			'Spring Planting Guide',
			'Member Spotlight',
			'Upcoming Events',
		],
		intro:
			'This edition brings together seasonal advice, community updates, and upcoming activities as the site moves into spring.',
		sections: [
			{
				title: 'Inside This Issue',
				body: 'Meet new members, look ahead to the spring calendar, and catch up on site news, seasonal jobs, and fresh recipe ideas for the months ahead.',
			},
			{
				title: 'Feature Story',
				body: "From Seed to Harvest follows Sarah's first year as an allotment holder, showing how support, patience, and practice helped build confidence over one growing season.",
			},
			{
				title: 'Seasonal Tip',
				body: 'Prepare beds early by adding compost and giving the soil time to settle before sowing. A little groundwork now can make spring planting much easier.',
			},
		],
	},
	{
		slug: 'winter-harvest-2025',
		title: 'Winter Harvest 2025',
		date: 'December 2025',
		preview:
			'Celebrating a year of growth with community achievements, winter growing tips, and holiday recipes.',
		topics: ['Year in Review', 'Winter Vegetables', 'Holiday Recipes', 'AGM Announcement'],
		intro:
			'Our winter issue reflects on the year, shares practical cold-season advice, and looks ahead to the next stage of the community project.',
		sections: [
			{
				title: 'Year in Review',
				body: 'This issue celebrates milestones across the site, from successful harvests to new volunteers and community events that brought people together.',
			},
			{
				title: 'Winter Growing',
				body: 'There is still plenty to do over winter, from protecting crops to planning rotations and making the most of hardy seasonal vegetables.',
			},
			{
				title: 'Community Updates',
				body: 'Read the AGM announcement, catch up on plans for the coming year, and see how members can shape the next season of work.',
			},
		],
	},
	{
		slug: 'autumn-newsletter-2025',
		title: 'Autumn Newsletter 2025',
		date: 'September 2025',
		preview:
			'Harvest time brings preserving ideas, seed saving advice, and autumn planting schedules.',
		topics: ['Harvest Festival', 'Seed Saving Workshop', 'Composting Tips', 'Autumn Events'],
		intro:
			'The autumn issue focuses on making the most of the harvest, sharing knowledge, and preparing both crops and community plans for the colder months.',
		sections: [
			{
				title: 'Harvest Season',
				body: 'Find updates on the harvest festival, shared meals, and the ways members are making use of late-season crops and surplus produce.',
			},
			{
				title: 'Seed Saving and Composting',
				body: 'This edition highlights practical ways to save seed, improve compost, and keep useful materials cycling back into next year’s garden.',
			},
			{
				title: 'What Happens Next',
				body: 'Autumn is also a planning season, with workshops, maintenance jobs, and future events all beginning to take shape.',
			},
		],
	},
];
