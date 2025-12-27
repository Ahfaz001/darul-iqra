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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admissions: {
        Row: {
          age: number
          created_at: string
          declaration_agreed: boolean
          education_medium: string
          email: string | null
          father_name: string
          full_name: string
          husband_name: string | null
          id: string
          mobile_number: string
          notes: string | null
          status: string
          submission_date: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          age: number
          created_at?: string
          declaration_agreed?: boolean
          education_medium: string
          email?: string | null
          father_name: string
          full_name: string
          husband_name?: string | null
          id?: string
          mobile_number: string
          notes?: string | null
          status?: string
          submission_date?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          age?: number
          created_at?: string
          declaration_agreed?: boolean
          education_medium?: string
          email?: string | null
          father_name?: string
          full_name?: string
          husband_name?: string | null
          id?: string
          mobile_number?: string
          notes?: string | null
          status?: string
          submission_date?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          marked_by: string
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          marked_by: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
        }
        Relationships: []
      }
      book_pages: {
        Row: {
          book_id: string
          created_at: string
          id: string
          normalized_text: string
          page_number: number
          text_content: string
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          normalized_text?: string
          page_number: number
          text_content?: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          normalized_text?: string
          page_number?: number
          text_content?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          language: string
          ocr_pages_done: number | null
          ocr_status: string | null
          title: string
          total_pages: number | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          language?: string
          ocr_pages_done?: number | null
          ocr_status?: string | null
          title: string
          total_pages?: number | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          language?: string
          ocr_pages_done?: number | null
          ocr_status?: string | null
          title?: string
          total_pages?: number | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      exam_assignments: {
        Row: {
          assigned_at: string
          end_time: string | null
          exam_id: string
          id: string
          start_time: string | null
          status: string
          student_id: string
        }
        Insert: {
          assigned_at?: string
          end_time?: string | null
          exam_id: string
          id?: string
          start_time?: string | null
          status?: string
          student_id: string
        }
        Update: {
          assigned_at?: string
          end_time?: string | null
          exam_id?: string
          id?: string
          start_time?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_assignments_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          created_at: string
          exam_id: string
          id: string
          marks: number
          question_number: number
          question_text_en: string | null
          question_text_roman: string | null
          question_text_ur: string
          question_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          id?: string
          marks?: number
          question_number: number
          question_text_en?: string | null
          question_text_roman?: string | null
          question_text_ur: string
          question_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          id?: string
          marks?: number
          question_number?: number
          question_text_en?: string | null
          question_text_roman?: string | null
          question_text_ur?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          exam_id: string
          feedback: string | null
          grade: string | null
          id: string
          is_published: boolean | null
          marks_obtained: number
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          feedback?: string | null
          grade?: string | null
          id?: string
          is_published?: boolean | null
          marks_obtained: number
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          feedback?: string | null
          grade?: string | null
          id?: string
          is_published?: boolean | null
          marks_obtained?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_submissions: {
        Row: {
          answer_status: string | null
          answer_text: string | null
          exam_id: string
          id: string
          marks_awarded: number | null
          question_id: string
          student_id: string
          submitted_at: string
        }
        Insert: {
          answer_status?: string | null
          answer_text?: string | null
          exam_id: string
          id?: string
          marks_awarded?: number | null
          question_id: string
          student_id: string
          submitted_at?: string
        }
        Update: {
          answer_status?: string | null
          answer_text?: string | null
          exam_id?: string
          id?: string
          marks_awarded?: number | null
          question_id?: string
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_submissions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_submissions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          exam_date: string
          id: string
          is_translated: boolean | null
          original_content: string | null
          subject: string
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          exam_date: string
          id?: string
          is_translated?: boolean | null
          original_content?: string | null
          subject: string
          title: string
          total_marks?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          exam_date?: string
          id?: string
          is_translated?: boolean | null
          original_content?: string | null
          subject?: string
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: []
      }
      hadith_books: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          language: string
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          language?: string
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          fcm_token: string | null
          full_name: string
          id: string
          language_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          fcm_token?: string | null
          full_name: string
          id?: string
          language_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          fcm_token?: string | null
          full_name?: string
          id?: string
          language_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quran_pages: {
        Row: {
          ayat_range: string | null
          created_at: string
          id: string
          page_number: number
          para_number: number | null
          quran_id: string
          surah_numbers: string[] | null
          text_content: string
        }
        Insert: {
          ayat_range?: string | null
          created_at?: string
          id?: string
          page_number: number
          para_number?: number | null
          quran_id: string
          surah_numbers?: string[] | null
          text_content?: string
        }
        Update: {
          ayat_range?: string | null
          created_at?: string
          id?: string
          page_number?: number
          para_number?: number | null
          quran_id?: string
          surah_numbers?: string[] | null
          text_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "quran_pages_quran_id_fkey"
            columns: ["quran_id"]
            isOneToOne: false
            referencedRelation: "quran_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      quran_uploads: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          is_searchable: boolean | null
          language: string
          title: string
          total_pages: number | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          is_searchable?: boolean | null
          language?: string
          title: string
          total_pages?: number | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_searchable?: boolean | null
          language?: string
          title?: string
          total_pages?: number | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
      attendance_status: "present" | "absent" | "late" | "excused"
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
    Enums: {
      app_role: ["admin", "teacher", "student"],
      attendance_status: ["present", "absent", "late", "excused"],
    },
  },
} as const
