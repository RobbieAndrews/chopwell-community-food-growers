import { CalendarDays, Clock3 } from "lucide-react";

import AddToCalendarButton from "./AddToCalendarButton";
import { getShortDateLabel, getTimeRangeLabel, parseDateKey } from "./calendarUtils";
import type { CalendarEvent } from "./types";

interface CalendarEventListSectionProps {
    events: CalendarEvent[];
    heading: string;
    emptyMessage: string;
    actionHref?: string;
    actionLabel?: string;
    className?: string;
    headingClassName?: string;
    actionClassName?: string;
}

const categoryBadgeStyles: Record<CalendarEvent["category"], string> = {
    Workshop: "bg-amber-100 text-amber-900 ring-amber-200",
    Volunteer: "bg-emerald-100 text-emerald-900 ring-emerald-200",
    Community: "bg-sky-100 text-sky-900 ring-sky-200",
    Maintenance: "bg-gray-200 text-gray-900 ring-gray-300",
};

export default function CalendarEventListSection({
    events,
    heading,
    emptyMessage,
    actionHref,
    actionLabel,
    className = "",
    headingClassName = "text-gray-900",
    actionClassName = "border-green-200 bg-green-50 text-green-800 hover:border-green-300 hover:bg-green-100",
}: CalendarEventListSectionProps) {
    return (
        <section className={`${className}`.trim()}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h3 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingClassName}`.trim()}>
                    {heading}
                </h3>

                {actionHref && actionLabel ? (
                    <a
                        href={actionHref}
                        className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition ${actionClassName}`.trim()}
                    >
                        {actionLabel}
                    </a>
                ) : null}
            </div>

            <div className="mt-4 space-y-4 sm:mt-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
                {events.length > 0 ? (
                    events.map((event) => (
                        <article
                            key={event.id}
                            className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white/80 p-4 shadow-sm shadow-gray-900/5 sm:p-5"
                        >
                            <div className="flex flex-1 flex-col gap-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={[
                                                    "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                                    categoryBadgeStyles[event.category],
                                                ].join(" ")}
                                            >
                                                {event.category}
                                            </span>
                                        </div>

                                        <h4 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                                            <a
                                                href={`/events/${event.slug}`}
                                                className="transition hover:text-green-700 focus:outline-none focus:text-green-700"
                                            >
                                                {event.title}
                                            </a>
                                        </h4>
                                    </div>
                                    <AddToCalendarButton event={event} className="lg:shrink-0" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm leading-6 text-gray-700 sm:text-base">
                                        {event.summary}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-green-700" aria-hidden="true" />
                                    {getShortDateLabel(parseDateKey(event.date))}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-green-700" aria-hidden="true" />
                                    {getTimeRangeLabel(event.startTime, event.endTime)}
                                </p>
                                <a
                                    href={`/events/${event.slug}`}
                                    className="font-semibold text-green-800 transition hover:text-green-700"
                                >
                                    View details
                                </a>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm leading-6 text-gray-600">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </section>
    );
}
