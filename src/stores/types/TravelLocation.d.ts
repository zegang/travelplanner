export interface TravelLocation {
  id: number | null; // Unique identifier (essential for mapping/syncing)
  title: string;
  date: string; // Consider using Date objects or ISO strings for better handling
  duration: string; // e.g., '3 Days'
  description: string;
  notes: string;
  images: string[]; // URLs or local paths to images
  weblinks: { label: string; url: string; }[];
  coordinates: {
    lat: number;
    lng: number;
  } | null,
  baiduCoordinates: {
    lat: number;
    lng: number;
  } | null
}