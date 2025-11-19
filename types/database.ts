export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          content: string;
          image: string;
          category: string;
          date: string;
          locale: string;
          created_at: string;
          updated_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          content: string;
          image: string;
          category: string;
          date: string;
          locale: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          image?: string;
          category?: string;
          date?: string;
          locale?: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          title_key: string | null;
          description: string;
          description_key: string | null;
          category: string;
          year: string;
          location: string;
          client: string;
          hero_image: string;
          gallery_images: string[];
          locale: string;
          created_at: string;
          updated_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          title_key?: string | null;
          description: string;
          description_key?: string | null;
          category: string;
          year: string;
          location: string;
          client: string;
          hero_image: string;
          gallery_images: string[];
          locale: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          title_key?: string | null;
          description?: string;
          description_key?: string | null;
          category?: string;
          year?: string;
          location?: string;
          client?: string;
          hero_image?: string;
          gallery_images?: string[];
          locale?: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
      };
      quotes: {
        Row: {
          id: string;
          customer_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          project_type: string;
          project_description: string | null;
          budget: string | null;
          location: string | null;
          status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
          admin_notes: string | null;
          proposal_document_url: string | null;
          quote_amount: number | null;
          attachment_urls: string[];
          customer_visible_notes: string | null;
          proposal_description: string | null;
          proposed_timeline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          project_type: string;
          project_description?: string | null;
          budget?: string | null;
          location?: string | null;
          status?: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
          admin_notes?: string | null;
          proposal_document_url?: string | null;
          quote_amount?: number | null;
          attachment_urls?: string[];
          customer_visible_notes?: string | null;
          proposal_description?: string | null;
          proposed_timeline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          project_type?: string;
          project_description?: string | null;
          budget?: string | null;
          location?: string | null;
          status?: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
          admin_notes?: string | null;
          proposal_document_url?: string | null;
          quote_amount?: number | null;
          attachment_urls?: string[];
          customer_visible_notes?: string | null;
          proposal_description?: string | null;
          proposed_timeline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          quote_id: string;
          customer_id: string;
          title: string;
          description: string | null;
          status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
          start_date: string | null;
          estimated_end_date: string | null;
          actual_end_date: string | null;
          progress_percentage: number;
          admin_notes: string | null;
          customer_visible_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          customer_id: string;
          title: string;
          description?: string | null;
          status?: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
          start_date?: string | null;
          estimated_end_date?: string | null;
          actual_end_date?: string | null;
          progress_percentage?: number;
          admin_notes?: string | null;
          customer_visible_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quote_id?: string;
          customer_id?: string;
          title?: string;
          description?: string | null;
          status?: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
          start_date?: string | null;
          estimated_end_date?: string | null;
          actual_end_date?: string | null;
          progress_percentage?: number;
          admin_notes?: string | null;
          customer_visible_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          company: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
          user_id: string | null; // Links to auth.users
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          company?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          company?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
      };
    };
  };
};

// Helper types for easier usage
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Quote = Database['public']['Tables']['quotes']['Row'];
export type Job = Database['public']['Tables']['jobs']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];

export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type QuoteInsert = Database['public']['Tables']['quotes']['Insert'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];

export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type QuoteUpdate = Database['public']['Tables']['quotes']['Update'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

