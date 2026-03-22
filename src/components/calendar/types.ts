export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    category: "Workshop" | "Volunteer" | "Community" | "Maintenance";
    description: string;
}
