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
      cities: {
        Row: {
          blurb: string | null
          created_at: string
          id: string
          lat: number
          lng: number
          name: string
          region: string
          sort_order: number
        }
        Insert: {
          blurb?: string | null
          created_at?: string
          id: string
          lat: number
          lng: number
          name: string
          region: string
          sort_order?: number
        }
        Update: {
          blurb?: string | null
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          region?: string
          sort_order?: number
        }
        Relationships: []
      }
      hotels: {
        Row: {
          amenities: string[]
          city_id: string
          created_at: string
          description: string | null
          dining: string | null
          hours: string | null
          id: string
          images: string[]
          lat: number
          lng: number
          name: string
          stars: number
        }
        Insert: {
          amenities?: string[]
          city_id: string
          created_at?: string
          description?: string | null
          dining?: string | null
          hours?: string | null
          id: string
          images?: string[]
          lat: number
          lng: number
          name: string
          stars: number
        }
        Update: {
          amenities?: string[]
          city_id?: string
          created_at?: string
          description?: string | null
          dining?: string | null
          hours?: string | null
          id?: string
          images?: string[]
          lat?: number
          lng?: number
          name?: string
          stars?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotels_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          city_id: string
          created_at: string
          description: string | null
          highlights: string[]
          hours: string | null
          id: string
          images: string[]
          lat: number
          lng: number
          name: string
          type: string
        }
        Insert: {
          city_id: string
          created_at?: string
          description?: string | null
          highlights?: string[]
          hours?: string | null
          id: string
          images?: string[]
          lat: number
          lng: number
          name: string
          type: string
        }
        Update: {
          city_id?: string
          created_at?: string
          description?: string | null
          highlights?: string[]
          hours?: string | null
          id?: string
          images?: string[]
          lat?: number
          lng?: number
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "places_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_proposals: {
        Row: {
          accommodation: string
          adults: number
          budget: string
          category: string
          children: number
          consent: boolean
          created_at: string
          destination: string
          email: string
          end_date: string
          flexible: boolean
          full_name: string
          id: string
          interests: string[]
          notes: string | null
          pace: string
          phone: string | null
          region: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          accommodation: string
          adults: number
          budget: string
          category: string
          children?: number
          consent: boolean
          created_at?: string
          destination: string
          email: string
          end_date: string
          flexible?: boolean
          full_name: string
          id?: string
          interests?: string[]
          notes?: string | null
          pace: string
          phone?: string | null
          region?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          accommodation?: string
          adults?: number
          budget?: string
          category?: string
          children?: number
          consent?: boolean
          created_at?: string
          destination?: string
          email?: string
          end_date?: string
          flexible?: boolean
          full_name?: string
          id?: string
          interests?: string[]
          notes?: string | null
          pace?: string
          phone?: string | null
          region?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
