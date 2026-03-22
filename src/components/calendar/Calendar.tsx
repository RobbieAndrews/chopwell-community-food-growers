import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

import {
    addMonths,
    formatDateKey,
    getCalendarDays,
    getDefaultSelectedDate,
    getEventsForVisibleMonth,
    getInitialVisibleMonth,
    getLongDateLabel,
    getMonthLabel,
    getShortDateLabel,
    getTimeRangeLabel,
    groupEventsByDate,
    isSameDay,
    isSameMonth,
    isToday,
    parseDateKey,
    startOfMonth,
    weekdayLabels,
} from "./calendarUtils";
import AddToCalendarButton from "./AddToCalendarButton";
import type { CalendarEvent } from "./types";

interface CalendarProps {
    events: CalendarEvent[];
    initialMonth?: string;
}

const categoryBadgeStyles: Record<CalendarEvent["category"], string> = {
    Workshop: "bg-amber-100 text-amber-900 ring-amber-200",
    Volunteer: "bg-emerald-100 text-emerald-900 ring-emerald-200",
    Community: "bg-sky-100 text-sky-900 ring-sky-200",
    Maintenance: "bg-stone-200 text-stone-900 ring-stone-300",
};

const categoryDotStyles: Record<CalendarEvent["category"], string> = {
    Workshop: "bg-amber-500",
    Volunteer: "bg-emerald-500",
    Community: "bg-sky-500",
    Maintenance: "bg-stone-500",
};

interface CalendarViewState {
    selectedDate: Date;
    visibleMonth: Date;
}

interface PopoverPosition {
    left: number;
    top: number;
    width: number;
}

interface DayDetailsPanelProps {
    dateLabel: string;
    events: CalendarEvent[];
    isMobile: boolean;
    onClose: () => void;
}

function DayDetailsPanel({
    dateLabel,
    events,
    isMobile,
    onClose,
}: DayDetailsPanelProps) {
    return (
        <div>
            {isMobile ? (
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-300" />
            ) : null}

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
                        Day schedule
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                        {dateLabel}
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full px-2 py-1 text-sm font-medium text-stone-500 transition hover:text-stone-800 focus:outline-none"
                >
                    Close
                </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-stone-600">
                {events.length > 0
                    ? "Here are the sessions currently planned for the selected day."
                    : "Nothing is scheduled for this day yet in the placeholder frontend data."}
            </p>

            <div className="mt-5 space-y-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <article
                            key={event.id}
                            className="rounded-3xl border border-stone-200 bg-stone-50 p-4"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={[
                                            "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                            categoryBadgeStyles[event.category],
                                        ].join(" ")}
                                    >
                                        {event.category}
                                    </span>
                                    <span className="text-sm font-medium text-stone-600">
                                        {getTimeRangeLabel(event.startTime, event.endTime)}
                                    </span>
                                </div>
                                <AddToCalendarButton event={event} />
                            </div>

                            <h4 className="mt-3 text-lg font-semibold tracking-tight text-stone-900">
                                {event.title}
                            </h4>
                            <p className="mt-2 text-sm font-medium text-stone-600">
                                {event.location}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-stone-700">
                                {event.description}
                            </p>
                        </article>
                    ))
                ) : (
                    <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm leading-6 text-stone-600">
                        Select another date or move to the next month using the arrow controls to explore more example events.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Calendar({ events, initialMonth }: CalendarProps) {
    const initialVisibleMonth = getInitialVisibleMonth(events, initialMonth);
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const dayButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [viewState, setViewState] = useState<CalendarViewState>(() => ({
        selectedDate: getDefaultSelectedDate(initialVisibleMonth, events),
        visibleMonth: initialVisibleMonth,
    }));
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [desktopPopoverPosition, setDesktopPopoverPosition] =
        useState<PopoverPosition | null>(null);
    const { selectedDate, visibleMonth } = viewState;

    const eventsByDate = groupEventsByDate(events);
    const calendarDays = getCalendarDays(visibleMonth);
    const selectedDateKey = formatDateKey(selectedDate);
    const selectedDateLabel = getLongDateLabel(selectedDate);
    const selectedEvents = eventsByDate[selectedDateKey] ?? [];
    const visibleMonthEvents = getEventsForVisibleMonth(visibleMonth, events);
    const showReturnToCurrentMonth = !isSameMonth(visibleMonth, currentMonth);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const updateViewport = () => {
            setIsMobileViewport(mediaQuery.matches);
        };

        updateViewport();
        mediaQuery.addEventListener("change", updateViewport);

        return () => {
            mediaQuery.removeEventListener("change", updateViewport);
        };
    }, []);

    useEffect(() => {
        if (!isDetailsOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsDetailsOpen(false);
            }
        }

        function handlePointerDown(event: MouseEvent | TouchEvent) {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (popoverRef.current?.contains(target)) {
                return;
            }

            if (dayButtonRefs.current[selectedDateKey]?.contains(target)) {
                return;
            }

            setIsDetailsOpen(false);
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };
    }, [isDetailsOpen, selectedDateKey]);

    useEffect(() => {
        if (!isDetailsOpen || isMobileViewport) {
            setDesktopPopoverPosition(null);
            return;
        }

        function updatePopoverPosition() {
            const gridElement = gridRef.current;
            const selectedButton = dayButtonRefs.current[selectedDateKey];

            if (!gridElement || !selectedButton) {
                setDesktopPopoverPosition(null);
                return;
            }

            const gridRect = gridElement.getBoundingClientRect();
            const buttonRect = selectedButton.getBoundingClientRect();
            const gutter = 12;
            const width = Math.min(360, Math.max(280, gridRect.width - gutter * 2));
            const estimatedHeight = selectedEvents.length > 1 ? 320 : 260;
            const preferredLeft =
                buttonRect.left - gridRect.left + buttonRect.width / 2 - width / 2;
            const left = Math.min(
                Math.max(preferredLeft, gutter),
                Math.max(gutter, gridRect.width - width - gutter),
            );
            const spaceBelow = gridRect.bottom - buttonRect.bottom;
            const spaceAbove = buttonRect.top - gridRect.top;
            const shouldPlaceAbove =
                spaceBelow < estimatedHeight && spaceAbove > estimatedHeight;
            const top = shouldPlaceAbove
                ? buttonRect.top - gridRect.top - estimatedHeight - 12
                : buttonRect.bottom - gridRect.top + 12;

            setDesktopPopoverPosition({ left, top, width });
        }

        updatePopoverPosition();
        window.addEventListener("resize", updatePopoverPosition);
        window.addEventListener("scroll", updatePopoverPosition, true);

        return () => {
            window.removeEventListener("resize", updatePopoverPosition);
            window.removeEventListener("scroll", updatePopoverPosition, true);
        };
    }, [isDetailsOpen, isMobileViewport, selectedDateKey, selectedEvents.length]);

    function updateVisibleMonth(monthOffset: number) {
        setIsDetailsOpen(false);
        setViewState((currentState) => {
            const nextMonth = addMonths(currentState.visibleMonth, monthOffset);

            return {
                selectedDate: getDefaultSelectedDate(nextMonth, events),
                visibleMonth: nextMonth,
            };
        });
    }

    function jumpToCurrentMonth() {
        setIsDetailsOpen(false);
        setViewState({
            selectedDate: getDefaultSelectedDate(currentMonth, events),
            visibleMonth: currentMonth,
        });
    }

    function handleDaySelection(day: Date) {
        setIsDetailsOpen(true);
        setViewState((currentState) => ({
            selectedDate: day,
            visibleMonth: isSameMonth(day, currentState.visibleMonth)
                ? currentState.visibleMonth
                : startOfMonth(day),
        }));
    }

    return (
        <div className="space-y-8">
            <section className="px-4 sm:rounded-4xl sm:border sm:border-stone-200 sm:bg-stone-50/75 sm:p-6 sm:shadow-sm sm:shadow-stone-200/70">
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => updateVisibleMonth(-1)}
                            aria-label={`Show ${getMonthLabel(addMonths(visibleMonth, -1))}`}
                            className="inline-flex items-center justify-center px-1 py-1 text-stone-700 transition hover:text-green-700 focus:outline-none"
                        >
                            <span aria-hidden="true" className="text-3xl leading-none sm:text-4xl">
                                &#8249;
                            </span>
                        </button>
                        <h2 className="min-w-40 text-center text-xl font-semibold tracking-tight text-stone-900 sm:min-w-44 sm:text-2xl">
                            {getMonthLabel(visibleMonth)}
                        </h2>
                        <button
                            type="button"
                            onClick={() => updateVisibleMonth(1)}
                            aria-label={`Show ${getMonthLabel(addMonths(visibleMonth, 1))}`}
                            className="inline-flex items-center justify-center px-1 py-1 text-stone-700 transition hover:text-green-700 focus:outline-none"
                        >
                            <span aria-hidden="true" className="text-3xl leading-none sm:text-4xl">
                                &#8250;
                            </span>
                        </button>
                    </div>
                </div>

                {showReturnToCurrentMonth ? (
                    <div className="mt-4 flex justify-start">
                        <button
                            type="button"
                            onClick={jumpToCurrentMonth}
                            className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 transition hover:border-green-300 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-stone-50"
                        >
                            Return to current month
                        </button>
                    </div>
                ) : null}

                <div className="relative mt-5">
                    <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-500 sm:gap-3 sm:text-sm sm:tracking-[0.22em]">
                        {weekdayLabels.map((weekday) => (
                            <div key={weekday} className="py-2">
                                {weekday}
                            </div>
                        ))}
                    </div>

                    <div
                        ref={gridRef}
                        className="mt-2 grid grid-cols-7 gap-x-1 gap-y-2 sm:gap-3"
                        role="grid"
                        aria-label={getMonthLabel(visibleMonth)}
                    >
                        {calendarDays.map((day) => {
                            const dateKey = formatDateKey(day);
                            const dayEvents = eventsByDate[dateKey] ?? [];
                            const isCurrentMonth = isSameMonth(day, visibleMonth);
                            const isSelected = isSameDay(day, selectedDate);
                            const isSelectionActive = isSelected && isDetailsOpen;
                            const buttonClasses = [
                                "relative flex aspect-square w-full items-center justify-center rounded-full border text-left transition focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-stone-50 sm:h-auto sm:min-h-[7.25rem] sm:w-full sm:flex-col sm:items-stretch sm:justify-between sm:rounded-[1.35rem] sm:p-3",
                                isCurrentMonth
                                    ? "border-stone-200 bg-white text-stone-800 hover:border-green-300 hover:bg-green-50/60"
                                    : "border-stone-200/70 bg-stone-100/70 text-stone-400 hover:border-stone-300 hover:bg-stone-100",
                                isSelectionActive
                                    ? "border-green-600 bg-green-50 shadow-lg shadow-green-950/10 ring-2 ring-green-200"
                                    : "",
                                !isSelectionActive && isToday(day) ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-50" : "",
                            ]
                                .filter(Boolean)
                                .join(" ");

                            return (
                                <button
                                    key={dateKey}
                                    ref={(node) => {
                                        dayButtonRefs.current[dateKey] = node;
                                    }}
                                    type="button"
                                    role="gridcell"
                                    aria-pressed={isSelectionActive}
                                    aria-expanded={isSelectionActive}
                                    aria-controls="calendar-day-details"
                                    aria-label={`${getLongDateLabel(day)}${dayEvents.length ? `, ${dayEvents.length} events` : ", no events"}`}
                                    onClick={() => handleDaySelection(day)}
                                    className={buttonClasses}
                                >
                                    <span
                                        className={[
                                            "text-sm font-semibold sm:m-0 sm:text-base",
                                            isCurrentMonth
                                                ? "text-stone-800"
                                                : "text-stone-400",
                                        ].join(" ")}
                                    >
                                        {day.getDate()}
                                    </span>

                                    {dayEvents.length > 0 ? (
                                        <>
                                            <span
                                                className={[
                                                    "absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full sm:hidden",
                                                    isSelectionActive
                                                        ? "bg-green-700"
                                                        : categoryDotStyles[dayEvents[0].category],
                                                ].join(" ")}
                                                aria-hidden="true"
                                            />
                                            <div className="hidden space-y-2 sm:block">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {dayEvents.slice(0, 3).map((event) => (
                                                        <span
                                                            key={event.id}
                                                            className={[
                                                                "h-2.5 w-2.5 rounded-full",
                                                                isSelectionActive
                                                                    ? "bg-green-700"
                                                                    : categoryDotStyles[event.category],
                                                            ].join(" ")}
                                                            aria-hidden="true"
                                                        />
                                                    ))}
                                                </div>

                                                <p
                                                    className={[
                                                        "text-xs leading-5 line-clamp-2",
                                                        isSelectionActive ? "text-stone-700" : "text-stone-500",
                                                    ].join(" ")}
                                                >
                                                    {dayEvents[0]?.title}
                                                </p>
                                            </div>
                                        </>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>

                    {isDetailsOpen && !isMobileViewport && desktopPopoverPosition ? (
                        <div
                            id="calendar-day-details"
                            ref={popoverRef}
                            role="dialog"
                            aria-modal="false"
                            aria-label={`Events for ${selectedDateLabel}`}
                            className="absolute z-30 hidden rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-300/30 md:block"
                            style={{
                                left: `${desktopPopoverPosition.left}px`,
                                top: `${desktopPopoverPosition.top}px`,
                                width: `${desktopPopoverPosition.width}px`,
                            }}
                        >
                            <DayDetailsPanel
                                dateLabel={selectedDateLabel}
                                events={selectedEvents}
                                isMobile={false}
                                onClose={() => setIsDetailsOpen(false)}
                            />
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="mx-4 rounded-4xl border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/70 sm:mx-0 sm:p-8">
                <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
                            Community Events
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                            {getMonthLabel(visibleMonth)}
                        </h3>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    {visibleMonthEvents.length > 0 ? (
                        visibleMonthEvents.map((event) => (
                            <article
                                key={event.id}
                                className="rounded-3xl border border-stone-200 bg-stone-50/70 p-5 shadow-sm shadow-stone-200/40"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                                            <h4 className="text-xl font-semibold tracking-tight text-stone-900">
                                                {event.title}
                                            </h4>
                                        </div>

                                        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 sm:text-base">
                                            {event.description}
                                        </p>
                                    </div>
                                    <AddToCalendarButton event={event} className="lg:shrink-0" />
                                    </div>

                                <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2 xl:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
                                    <p className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-green-700" aria-hidden="true" />
                                        {getShortDateLabel(parseDateKey(event.date))}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4 text-green-700" aria-hidden="true" />
                                        {getTimeRangeLabel(event.startTime, event.endTime)}
                                    </p>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm leading-6 text-stone-600">
                            There are no events in {getMonthLabel(visibleMonth)} yet.
                        </div>
                    )}
                </div>
            </section>

            {isDetailsOpen && isMobileViewport ? (
                <div className="md:hidden">
                    <button
                        type="button"
                        aria-label="Close day schedule"
                        onClick={() => setIsDetailsOpen(false)}
                        className="fixed inset-0 z-40 bg-stone-950/35"
                    />
                    <div
                        id="calendar-day-details"
                        ref={popoverRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Events for ${selectedDateLabel}`}
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-y-auto rounded-t-4xl border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-950/20"
                    >
                        <DayDetailsPanel
                            dateLabel={selectedDateLabel}
                            events={selectedEvents}
                            isMobile
                            onClose={() => setIsDetailsOpen(false)}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
