export interface CarView {
  id: string;
  car_id: string;
  viewed_at: Date;
  ip_hash: string;
  user_agent: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  car_id?: string | null;
  car_title?: string | null;
  message: string;
  submitted_at: Date;
  ip_hash: string;
}

export interface AnalyticsStats {
  totalViews: number;
  viewsByMake: { make: string; count: number }[];
  recentViews: {
    car_id: string;
    car_title: string;
    view_count: number;
    last_viewed: Date;
  }[];
  recentSubmissions: ContactSubmission[];
}
