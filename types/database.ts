/**
 * Supabase Database type definitions.
 * Matches the schema defined in supabase/schema.sql.
 *
 * You can regenerate this automatically once you have the Supabase CLI:
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > types/database.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      page_content: {
        Row: {
          id:          string;
          page:        "home" | "about" | "contact";
          section_key: string;
          content:     string;
          updated_at:  string;
          updated_by:  string | null;
        };
        Insert: {
          id?:         string;
          page:        "home" | "about" | "contact";
          section_key: string;
          content?:    string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?:         string;
          page?:       "home" | "about" | "contact";
          section_key?: string;
          content?:    string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
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
    Enums: Record<string, never>;
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
