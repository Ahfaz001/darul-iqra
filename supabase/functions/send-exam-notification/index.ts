import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  console.log("Attempting to send email to:", to);
  console.log("RESEND_API_KEY present:", !!RESEND_API_KEY);
  
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Idarah Tarjumat-ul-Quran <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  
  const responseText = await response.text();
  console.log("Resend API response status:", response.status);
  console.log("Resend API response:", responseText);
  
  if (!response.ok) {
    throw new Error(`Resend API error: ${responseText}`);
  }
  
  return JSON.parse(responseText);
}

interface NotificationRequest {
  student_ids: string[];
  exam_title: string;
  exam_subject: string;
  exam_date: string;
  duration_minutes: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { student_ids, exam_title, exam_subject, exam_date, duration_minutes }: NotificationRequest = await req.json();

    console.log("Sending exam notifications to", student_ids.length, "students");

    // Create Supabase client to fetch student emails
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch student profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", student_ids);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw new Error("Failed to fetch student profiles");
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profiles found for the given student IDs");
      return new Response(JSON.stringify({ sent: 0, message: "No students found" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailPromises = profiles
      .filter(profile => profile.email)
      .map(async (profile) => {
        try {
          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ادارہ ترجمۃ القرآن والسنہ</h1>
                  <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 14px;">Idarah Tarjumat-ul-Quran Wa Sunnah</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                  <h2 style="color: #1e3a5f; margin: 0 0 20px 0;">Assalamu Alaikum, ${profile.full_name}!</h2>
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    A new exam has been assigned to you. Please review the details below and prepare accordingly.
                  </p>
                  
                  <!-- Exam Details Card -->
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37;">
                    <h3 style="color: #1e3a5f; margin: 0 0 15px 0; font-size: 18px;">📝 Exam Details</h3>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Title:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${exam_title}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Subject:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${exam_subject}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Date:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${exam_date}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Duration:</td>
                        <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${duration_minutes} minutes</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Urdu Message -->
                  <div style="background-color: #1e3a5f; color: #ffffff; padding: 20px; border-radius: 8px; text-align: right; margin: 20px 0;" dir="rtl">
                    <p style="margin: 0; font-size: 16px; line-height: 1.8;">
                      آپ کو ایک نیا امتحان تفویض کیا گیا ہے۔ براہ کرم اپنی تیاری کریں۔
                    </p>
                  </div>
                  
                  <p style="color: #333; font-size: 14px; line-height: 1.6;">
                    May Allah grant you success in your studies.<br>
                    <strong>JazakAllahu Khairan</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    Idarah Tarjumat-ul-Quran Wa Sunnah | Kalyan<br>
                    This is an automated notification.
                  </p>
                </div>
                
              </div>
            </body>
            </html>
          `;

          const result = await sendEmail(
            profile.email,
            `📚 New Exam Assigned: ${exam_title}`,
            emailHtml
          );

          console.log("Email sent to", profile.email, ":", result);
          return { email: profile.email, success: true };
        } catch (emailError: any) {
          console.error("Failed to send email to", profile.email, ":", emailError);
          return { email: profile.email, success: false, error: emailError.message };
        }
      });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Sent ${successCount} of ${results.length} emails successfully`);

    return new Response(JSON.stringify({ 
      sent: successCount, 
      total: results.length,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-exam-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
