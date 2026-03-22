import type { CalendarEvent } from "./types";

const UK_TIMEZONE = "Europe/London";

function padDatePart(value: number) {
    return `${value}`.padStart(2, "0");
}

function parseEventDateTime(date: string, time: string) {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes, 0);
}

function formatCalendarStamp(date: Date) {
    return [
        date.getFullYear(),
        padDatePart(date.getMonth() + 1),
        padDatePart(date.getDate()),
        "T",
        padDatePart(date.getHours()),
        padDatePart(date.getMinutes()),
        "00",
    ].join("");
}

function formatUtcStamp(date: Date) {
    return [
        date.getUTCFullYear(),
        padDatePart(date.getUTCMonth() + 1),
        padDatePart(date.getUTCDate()),
        "T",
        padDatePart(date.getUTCHours()),
        padDatePart(date.getUTCMinutes()),
        "00Z",
    ].join("");
}

function escapeIcsText(value: string) {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
}

function getEventDateTimes(event: CalendarEvent) {
    return {
        startDateTime: parseEventDateTime(event.date, event.startTime),
        endDateTime: parseEventDateTime(event.date, event.endTime),
    };
}

function buildIcsFileName(title: string) {
    return `${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "event"}.ics`;
}

export function buildGoogleCalendarUrl(event: CalendarEvent) {
    const { startDateTime, endDateTime } = getEventDateTimes(event);
    const url = new URL("https://calendar.google.com/calendar/render");

    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", event.title);
    url.searchParams.set("details", event.description);
    url.searchParams.set(
        "dates",
        `${formatCalendarStamp(startDateTime)}/${formatCalendarStamp(endDateTime)}`,
    );
    url.searchParams.set("ctz", UK_TIMEZONE);

    return url.toString();
}

export function buildIcsContent(event: CalendarEvent) {
    const { startDateTime, endDateTime } = getEventDateTimes(event);
    const timestamp = formatUtcStamp(new Date());
    const uid = `${event.id}@ccfg.local`;

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Chopwell Community Food Growers//Calendar Event//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART;TZID=${UK_TIMEZONE}:${formatCalendarStamp(startDateTime)}`,
        `DTEND;TZID=${UK_TIMEZONE}:${formatCalendarStamp(endDateTime)}`,
        `SUMMARY:${escapeIcsText(event.title)}`,
        `DESCRIPTION:${escapeIcsText(event.description)}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");
}

export function downloadIcsFile(event: CalendarEvent) {
    const icsContent = buildIcsContent(event);
    const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = buildIcsFileName(event.title);
    link.click();

    URL.revokeObjectURL(downloadUrl);
}
