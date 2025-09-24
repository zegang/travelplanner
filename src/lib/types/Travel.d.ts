import type { TravelLocation } from "@/lib/types/TravelLocation"

export interface Travel {
  id?: number; // negative == null
  title: string;
  dateStart: Date;
  dateEnd: Date;
  description: string;
  images: string[];
  locations: TravelLocation[]
};
