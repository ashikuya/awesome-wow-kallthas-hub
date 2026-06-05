export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      forum_boards: {
        Row: {
          category_id: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_boards_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          edited_at: string | null
          id: string
          thread_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          edited_at?: string | null
          id?: string
          thread_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_thread_stats"
            referencedColumns: ["thread_id"]
          },
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          board_id: string
          created_at: string
          id: string
          last_post_at: string
          locked: boolean
          sticky: boolean
          title: string
          view_count: number
        }
        Insert: {
          author_id: string
          board_id: string
          created_at?: string
          id?: string
          last_post_at?: string
          locked?: boolean
          sticky?: boolean
          title: string
          view_count?: number
        }
        Update: {
          author_id?: string
          board_id?: string
          created_at?: string
          id?: string
          last_post_at?: string
          locked?: boolean
          sticky?: boolean
          title?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "forum_board_stats"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "forum_threads_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "forum_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          body: string | null
          category: string
          created_at: string
          excerpt: string
          id: string
          published: boolean
          title: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          excerpt: string
          id?: string
          published?: boolean
          title: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          donor_coins: number
          faction: string | null
          game_account: string
          id: string
          updated_at: string
          vote_points: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          donor_coins?: number
          faction?: string | null
          game_account: string
          id: string
          updated_at?: string
          vote_points?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          donor_coins?: number
          faction?: string | null
          game_account?: string
          id?: string
          updated_at?: string
          vote_points?: number
        }
        Relationships: []
      }
      realm_status: {
        Row: {
          alliance_count: number
          horde_count: number
          id: number
          online: boolean
          players_online: number
          updated_at: string
          uptime_seconds: number
        }
        Insert: {
          alliance_count?: number
          horde_count?: number
          id?: number
          online?: boolean
          players_online?: number
          updated_at?: string
          uptime_seconds?: number
        }
        Update: {
          alliance_count?: number
          horde_count?: number
          id?: number
          online?: boolean
          players_online?: number
          updated_at?: string
          uptime_seconds?: number
        }
        Relationships: []
      }
      vote_logs: {
        Row: {
          id: string
          points_awarded: number
          site: string
          user_id: string
          voted_at: string
        }
        Insert: {
          id?: string
          points_awarded?: number
          site: string
          user_id: string
          voted_at?: string
        }
        Update: {
          id?: string
          points_awarded?: number
          site?: string
          user_id?: string
          voted_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      forum_board_stats: {
        Row: {
          board_id: string | null
          last_post_at: string | null
          post_count: number | null
          thread_count: number | null
        }
        Relationships: []
      }
      forum_thread_stats: {
        Row: {
          last_post_at: string | null
          last_post_user_id: string | null
          post_count: number | null
          thread_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
