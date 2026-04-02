export interface CalendarEvent {
    id: string;
    slug: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    category: "Workshop" | "Volunteer" | "Community" | "Maintenance";
    summary: string;
}
