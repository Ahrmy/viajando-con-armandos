export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      families: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "families_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          profile_id: string;
          role: Database["public"]["Enums"]["family_member_role"];
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          profile_id: string;
          role?: Database["public"]["Enums"]["family_member_role"];
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          profile_id?: string;
          role?: Database["public"]["Enums"]["family_member_role"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "family_members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          destination: string | null;
          start_date: string | null;
          end_date: string | null;
          status: Database["public"]["Enums"]["trip_status"];
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          destination?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: Database["public"]["Enums"]["trip_status"];
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          title?: string;
          destination?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: Database["public"]["Enums"]["trip_status"];
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trips_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trips_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_members: {
        Row: {
          id: string;
          trip_id: string;
          profile_id: string;
          role: Database["public"]["Enums"]["trip_member_role"];
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          profile_id: string;
          role?: Database["public"]["Enums"]["trip_member_role"];
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          profile_id?: string;
          role?: Database["public"]["Enums"]["trip_member_role"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_days: {
        Row: {
          id: string;
          trip_id: string;
          day_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          day_date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          day_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      activities: {
        Row: {
          id: string;
          trip_day_id: string;
          title: string;
          description: string | null;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          status: Database["public"]["Enums"]["activity_status"];
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_day_id: string;
          title: string;
          description?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          status?: Database["public"]["Enums"]["activity_status"];
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_day_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          status?: Database["public"]["Enums"]["activity_status"];
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_trip_day_id_fkey";
            columns: ["trip_day_id"];
            isOneToOne: false;
            referencedRelation: "trip_days";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          trip_id: string;
          title: string;
          description: string | null;
          status: Database["public"]["Enums"]["task_status"];
          assigned_to: string | null;
          due_date: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          title: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          assigned_to?: string | null;
          due_date?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          title?: string;
          description?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          assigned_to?: string | null;
          due_date?: string | null;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          id: string;
          trip_id: string;
          paid_by: string;
          title: string;
          amount: number;
          currency: string;
          category: string | null;
          expense_date: string;
          split_type: Database["public"]["Enums"]["split_type"];
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          paid_by: string;
          title: string;
          amount: number;
          currency?: string;
          category?: string | null;
          expense_date?: string;
          split_type?: Database["public"]["Enums"]["split_type"];
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          paid_by?: string;
          title?: string;
          amount?: number;
          currency?: string;
          category?: string | null;
          expense_date?: string;
          split_type?: Database["public"]["Enums"]["split_type"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_paid_by_fkey";
            columns: ["paid_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      expense_splits: {
        Row: {
          id: string;
          expense_id: string;
          profile_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          profile_id: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_id?: string;
          profile_id?: string;
          amount?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expense_splits_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expense_splits_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      packing_items: {
        Row: {
          id: string;
          trip_id: string;
          title: string;
          quantity: number;
          packed: boolean;
          assigned_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          title: string;
          quantity?: number;
          packed?: boolean;
          assigned_to?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          title?: string;
          quantity?: number;
          packed?: boolean;
          assigned_to?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "packing_items_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "packing_items_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          id: string;
          trip_id: string;
          profile_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          profile_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          profile_id?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          message: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: string;
          message: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          type?: string;
          message?: string;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      family_member_role: "owner" | "admin" | "member";
      trip_status: "draft" | "active" | "completed" | "cancelled";
      trip_member_role: "owner" | "editor" | "viewer";
      activity_status: "planned" | "done" | "cancelled";
      task_status: "todo" | "doing" | "done";
      split_type: "equal" | "custom";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helpers de conveniencia
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
