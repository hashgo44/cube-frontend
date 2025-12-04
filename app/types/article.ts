export interface Article {
  id: number;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  location: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ArticleCreate {
  title: string;
  description?: string;
  price: number;
  category?: string;
  location?: string;
  contact_email?: string;
}


