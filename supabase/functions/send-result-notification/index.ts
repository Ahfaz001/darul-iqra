import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResultNotificationRequest {
  student_id: string;
  student_email: string;
  student_name: string;
  exam_title: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  feedback?: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
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
      from: "Madrasa Al-Hidaya <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Resend API error: ${JSON.stringify(data)}`);
  }
  
  return data;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Result notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ResultNotificationRequest = await req.json();
    console.log("Received data:", JSON.stringify(data, null, 2));

    const {
      student_id,
      student_email,
      student_name,
      exam_title,
      subject,
      marks_obtained,
      total_marks,
      grade,
      feedback,
    } = data;

    if (!student_email) {
      console.error("No email provided for student:", student_id);
      return new Response(
        JSON.stringify({ error: "No email provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const percentage = ((marks_obtained / total_marks) * 100).toFixed(1);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .result-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .grade { font-size: 48px; font-weight: bold; color: #10b981; margin: 10px 0; }
          .marks { font-size: 18px; color: #374151; }
          .percentage { font-size: 14px; color: #6b7280; margin-top: 5px; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { color: #6b7280; }
          .detail-value { color: #111827; font-weight: 500; }
          .feedback { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .feedback-title { font-weight: 600; color: #92400e; margin-bottom: 5px; }
          .feedback-text { color: #78350f; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Exam Result Published</h1>
          </div>
          <div class="content">
            <p>Assalam-o-Alaikum <strong>${student_name}</strong>,</p>
            <p>Your exam result has been published:</p>
            
            <div class="result-card">
              <div class="marks">${marks_obtained} / ${total_marks}</div>
              <div class="grade">Grade: ${grade}</div>
              <div class="percentage">${percentage}%</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Exam</span>
                <span class="detail-value">${exam_title}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Subject</span>
                <span class="detail-value">${subject}</span>
              </div>
            </div>
            
            ${feedback ? `
            <div class="feedback">
              <div class="feedback-title">Teacher's Feedback:</div>
              <div class="feedback-text">${feedback}</div>
            </div>
            ` : ''}
            
            <p>You can view your complete results by logging into your student portal.</p>
            <p>Best regards,<br><strong>Madrasa Al-Hidaya</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Sending email to:", student_email);

    const emailResponse = await sendEmail(
      student_email,
      `📊 Your Exam Result: ${exam_title} - Grade ${grade}`,
      htmlContent
    );

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending result notification:", error);
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
