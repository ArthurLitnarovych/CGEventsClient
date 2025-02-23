export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  eventDate: string;
  location: { lat: number; lng: number };
}

export const EventCategory = [
  "Conference",
  "Workshop",
  "Webinar",
  "Networking",
];
