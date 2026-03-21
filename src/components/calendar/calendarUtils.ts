import type { CalendarEvent } from "./types";

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
});

export const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function createDate(year: number, month: number, day: number) {
    return new Date(year, month, day, 12);
}

export function parseDateKey(dateKey: string) {
    const [year, month, day] = dateKey.split("-").map(Number);

    return createDate(year, month - 1, day);
}

export function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function startOfMonth(date: Date) {
    return createDate(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
    return createDate(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameMonth(left: Date, right: Date) {
    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth()
    );
}

export function isSameDay(left: Date, right: Date) {
    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth() &&
        left.getDate() === right.getDate()
    );
}

export function isToday(date: Date) {
    const today = new Date();

    return isSameDay(date, createDate(today.getFullYear(), today.getMonth(), today.getDate()));
}

export function getMonthLabel(date: Date) {
    return monthFormatter.format(date);
}

export function getLongDateLabel(date: Date) {
    return longDateFormatter.format(date);
}

export function getShortDateLabel(date: Date) {
    return shortDateFormatter.format(date);
}

export function getTimeRangeLabel(startTime: string, endTime: string) {
    const startDate = parseTimeLabel(startTime);
    const endDate = parseTimeLabel(endTime);

    return `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
}

export function getCalendarDays(visibleMonth: Date) {
    const monthStart = startOfMonth(visibleMonth);
    const monthStartOffset = (monthStart.getDay() + 6) % 7;
    const firstGridDay = createDate(
        monthStart.getFullYear(),
        monthStart.getMonth(),
        1 - monthStartOffset,
    );

    return Array.from({ length: 42 }, (_, index) =>
        createDate(
            firstGridDay.getFullYear(),
            firstGridDay.getMonth(),
            firstGridDay.getDate() + index,
        ),
    );
}

function getTimeValue(timeLabel: string) {
    const [hours, minutes] = timeLabel.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return Number.MAX_SAFE_INTEGER;
    }

    return hours * 60 + minutes;
}

function parseTimeLabel(timeLabel: string) {
    const [hours, minutes] = timeLabel.split(":").map(Number);

    return new Date(2000, 0, 1, hours, minutes);
}

export function groupEventsByDate(events: CalendarEvent[]) {
    const groupedEvents: Record<string, CalendarEvent[]> = {};

    for (const event of events) {
        groupedEvents[event.date] ??= [];
        groupedEvents[event.date].push(event);
    }

    for (const dateKey of Object.keys(groupedEvents)) {
        groupedEvents[dateKey].sort(
            (left, right) => getTimeValue(left.startTime) - getTimeValue(right.startTime),
        );
    }

    return groupedEvents;
}

export function getInitialVisibleMonth(
    events: CalendarEvent[],
    initialMonth?: string,
) {
    if (initialMonth) {
        return startOfMonth(parseDateKey(initialMonth));
    }

    const firstEvent = [...events].sort((left, right) =>
        left.date.localeCompare(right.date),
    )[0];

    return startOfMonth(parseDateKey(firstEvent?.date ?? formatDateKey(new Date())));
}

export function getDefaultSelectedDate(
    visibleMonth: Date,
    events: CalendarEvent[],
) {
    const monthKey = `${visibleMonth.getFullYear()}-${`${visibleMonth.getMonth() + 1}`.padStart(2, "0")}`;
    const firstEventInMonth = [...events]
        .sort((left, right) =>
            `${left.date}-${left.startTime}`.localeCompare(`${right.date}-${right.startTime}`),
        )
        .find((event) => event.date.startsWith(monthKey));

    return firstEventInMonth
        ? parseDateKey(firstEventInMonth.date)
        : startOfMonth(visibleMonth);
}

export function getEventsForVisibleMonth(
    visibleMonth: Date,
    events: CalendarEvent[],
) {
    return [...events]
        .filter((event) => {
            const eventDate = parseDateKey(event.date);

            return isSameMonth(eventDate, visibleMonth);
        })
        .sort((left, right) =>
            `${left.date}-${left.startTime}`.localeCompare(`${right.date}-${right.startTime}`),
        );
}
