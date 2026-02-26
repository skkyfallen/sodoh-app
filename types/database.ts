/**
 * Supabase Database type definitions.
 * Matches the schema defined in supabase/schema.sql.
 *
 * Regenerate automatically with the Supabase CLI:
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > types/database.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      /* ── site_content ── */
      site_content: {
        Row: {
          id:         string;
          page:       string;
          section:    string;
          content:    Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?:        string;
          page:       string;
          section:    string;
          content?:   Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?:        string;
          page?:      string;
          section?:   string;
          content?:   Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };

      /* ── products ── */
      products: {
        Row: {
          id:            string;
          title:         string;
          slug:          string;
          region:        string | null;
          description:   string | null;
          image_url:     string | null;
          image_alt:     string | null;
          icon:          string | null;
          display_order: number;
          is_active:     boolean;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:           string;
          title:         string;
          slug:          string;
          region?:       string | null;
          description?:  string | null;
          image_url?:    string | null;
          image_alt?:    string | null;
          icon?:         string | null;
          display_order?: number;
          is_active?:    boolean;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: {
          id?:           string;
          title?:        string;
          slug?:         string;
          region?:       string | null;
          description?:  string | null;
          image_url?:    string | null;
          image_alt?:    string | null;
          icon?:         string | null;
          display_order?: number;
          is_active?:    boolean;
          created_at?:   string;
          updated_at?:   string;
        };
        Relationships: [];
      };

      /* ── stats ── */
      stats: {
        Row: {
          id:            string;
          value:         string;
          label:         string;
          sub:           string | null;
          display_order: number;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:           string;
          value:         string;
          label:         string;
          sub?:          string | null;
          display_order?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: {
          id?:           string;
          value?:        string;
          label?:        string;
          sub?:          string | null;
          display_order?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Relationships: [];
      };

      /* ── pillars ── */
      pillars: {
        Row: {
          id:            string;
          step:          string;
          title:         string;
          tag:           string | null;
          description:   string | null;
          icon:          string | null;
          display_order: number;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:           string;
          step:          string;
          title:         string;
          tag?:          string | null;
          description?:  string | null;
          icon?:         string | null;
          display_order?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: {
          id?:           string;
          step?:         string;
          title?:        string;
          tag?:          string | null;
          description?:  string | null;
          icon?:         string | null;
          display_order?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Relationships: [];
      };

      /* ── faqs ── */
      faqs: {
        Row: {
          id:            string;
          question:      string;
          answer:        string;
          display_order: number;
          is_active:     boolean;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:           string;
          question:      string;
          answer:        string;
          display_order?: number;
          is_active?:    boolean;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: {
          id?:           string;
          question?:     string;
          answer?:       string;
          display_order?: number;
          is_active?:    boolean;
          created_at?:   string;
          updated_at?:   string;
        };
        Relationships: [];
      };

      /* ── testimonials ── */
      testimonials: {
        Row: {
          id:            string;
          quote:         string;
          author_name:   string;
          author_role:   string | null;
          author_image:  string | null;
          is_active:     boolean;
          display_order: number;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:           string;
          quote:         string;
          author_name:   string;
          author_role?:  string | null;
          author_image?: string | null;
          is_active?:    boolean;
          display_order?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: {
          id?:           string;
          quote?:        string;
          author_name?:  string;
          author_role?:  string | null;
          author_image?: string | null;
          is_active?:    boolean;
          display_order?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Relationships: [];
      };

      /* ── contact_submissions ── */
      contact_submissions: {
        Row: {
          id:         string;
          name:       string;
          email:      string;
          subject:    string | null;
          message:    string;
          status:     "new" | "read" | "archived";
          created_at: string;
        };
        Insert: {
          id?:        string;
          name:       string;
          email:      string;
          subject?:   string | null;
          message:    string;
          status?:    "new" | "read" | "archived";
          created_at?: string;
        };
        Update: {
          id?:        string;
          name?:      string;
          email?:     string;
          subject?:   string | null;
          message?:   string;
          status?:    "new" | "read" | "archived";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      submission_status: "new" | "read" | "archived";
    };
    CompositeTypes: Record<string, never>;
  };
};

// Convenience helpers
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
