export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    category: "Workshop" | "Volunteer" | "Community" | "Maintenance";
    description: string;
}
