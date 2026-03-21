import { useEffect, useRef, useState } from "react";

import { buildGoogleCalendarUrl, downloadIcsFile } from "./calendarExport";
import type { CalendarEvent } from "./types";

interface AddToCalendarButtonProps {
    event: CalendarEvent;
    className?: string;
}

function CalendarPlusIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M3 10h18" />
            <path d="M12 14v4" />
            <path d="M10 16h4" />
        </svg>
    );
}

const baseButtonClassName =
    "inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 transition hover:border-green-300 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600";

export default function AddToCalendarButton({
    event,
    className = "",
}: AddToCalendarButtonProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(false);

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
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        function handlePointerDown(event: MouseEvent | TouchEvent) {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (containerRef.current?.contains(target)) {
                return;
            }

            setIsOpen(false);
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };
    }, [isOpen]);

    function openGoogleCalendar() {
        window.open(buildGoogleCalendarUrl(event), "_blank", "noopener,noreferrer");
        setIsOpen(false);
    }

    function handleIcsDownload() {
        downloadIcsFile(event);
        setIsOpen(false);
    }

    return (
        <div ref={containerRef} className={`relative ${className}`.trim()}>
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((currentState) => !currentState)}
                className={baseButtonClassName}
            >
                <CalendarPlusIcon />
                <span>Add to calendar</span>
            </button>

            {isOpen && !isMobileViewport ? (
                <div
                    role="dialog"
                    aria-modal="false"
                    aria-label={`Add ${event.title} to a calendar`}
                    className="absolute right-0 top-full z-40 mt-3 w-56 rounded-[1.5rem] border border-stone-200 bg-white p-2 shadow-xl shadow-stone-300/30"
                >
                    <button
                        type="button"
                        onClick={openGoogleCalendar}
                        className="flex w-full rounded-[1rem] px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-50"
                    >
                        Google Calendar
                    </button>
                    <button
                        type="button"
                        onClick={handleIcsDownload}
                        className="mt-1 flex w-full rounded-[1rem] px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-50"
                    >
                        Download .ics
                    </button>
                </div>
            ) : null}

            {isOpen && isMobileViewport ? (
                <div className="md:hidden">
                    <button
                        type="button"
                        aria-label="Close add to calendar actions"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-stone-950/35"
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Add ${event.title} to a calendar`}
                        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-950/20"
                    >
                        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-300" />
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
                                    Add to calendar
                                </p>
                                <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-900">
                                    {event.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center justify-center rounded-full px-2 py-1 text-sm font-medium text-stone-500 transition hover:text-stone-800 focus:outline-none"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-5 space-y-2">
                            <button
                                type="button"
                                onClick={openGoogleCalendar}
                                className="flex w-full rounded-[1rem] border border-stone-200 bg-stone-50 px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-100"
                            >
                                Google Calendar
                            </button>
                            <button
                                type="button"
                                onClick={handleIcsDownload}
                                className="flex w-full rounded-[1rem] border border-stone-200 bg-stone-50 px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-100"
                            >
                                Download .ics
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
