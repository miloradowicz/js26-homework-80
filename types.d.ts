export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Location {
  id: number;
  name: string;
  description: string | null;
}

export interface Resource {
  id: number;
  category_id: number;
  location_id: number;
  name: string;
  description: string | null;
  photo_url: string | null;
  created_at: string;
}

export type CategoryBody = Omit<Category, 'id'>;
export type LocationBody = Omit<Location, 'id'>;
export type ResourceBody = Omit<Resource, 'id'>;
