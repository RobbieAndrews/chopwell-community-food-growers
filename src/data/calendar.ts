import { parseDateKey } from "../components/calendar/calendarUtils";
import type { CalendarEvent } from "../components/calendar/types";

export const CALENDAR_EVENTS_QUERY = `*[
	_type == "calendarEvent"
	&& defined(date)
	&& defined(startTime)
	&& defined(endTime)
	&& defined(slug.current)
]|order(date asc, startTime asc){
	"title": title,
	"id": _id,
	"slug": slug.current,
	date,
	startTime,
	endTime,
	category,
	"summary": coalesce(summary, description)
}`;

function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

export function getEventsInNextDays(
    events: CalendarEvent[],
    days: number,
    fromDate = new Date(),
) {
    const rangeStart = normalizeDate(fromDate);
    const rangeEnd = new Date(rangeStart);
    rangeEnd.setDate(rangeEnd.getDate() + days);

    return [...events]
        .filter((event) => {
            const eventDate = parseDateKey(event.date);

            return eventDate >= rangeStart && eventDate <= rangeEnd;
        })
        .sort((left, right) =>
            `${left.date}-${left.startTime}`.localeCompare(`${right.date}-${right.startTime}`),
        );
}
