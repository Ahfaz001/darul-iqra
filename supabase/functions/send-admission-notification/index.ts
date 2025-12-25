import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdmissionNotificationRequest {
  studentName: string;
  mobileNumber: string;
  status: "approved" | "rejected";
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentName, mobileNumber, status, notes }: AdmissionNotificationRequest = await req.json();

    console.log(`Sending ${status} notification to ${studentName}`);

    const isApproved = status === "approved";
    const subject = isApproved 
      ? "🎉 Admission Approved - Idarah Tarjamat-ul-Qur'an wa Sunnah" 
      : "Admission Update - Idarah Tarjamat-ul-Qur'an wa Sunnah";

    const htmlContent = isApproved
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 24px;">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</h1>
            <p style="color: #666; font-style: italic;">"The best among you are those who learn the Qur'an and teach it."</p>
          </div>
          
          <h2 style="color: #059669;">Congratulations, ${studentName}! 🎉</h2>
          
          <p>Assalamu Alaikum wa Rahmatullahi wa Barakatuh,</p>
          
          <p>Your admission for <strong>Uloom e Shari'ah Course</strong> at <strong>Idarah Tarjamat-ul-Qur'an wa Sunnah</strong> has been <span style="color: #059669; font-weight: bold;">APPROVED</span>.</p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Course Details:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Duration: 5 Years</li>
              <li>Mode: Offline Only</li>
              <li>Fee: Free</li>
              <li>Instructor: Alimah Aayesha Muneer Khan</li>
            </ul>
          </div>
          
          ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
          
          <p>You will be contacted shortly with further details.</p>
          
          <p>Jazakallahu Khairan,<br/><strong>Idarah Tarjamat-ul-Qur'an wa Sunnah</strong></p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; font-size: 24px;">Idarah Tarjamat-ul-Qur'an wa Sunnah</h1>
          </div>
          
          <h2 style="color: #333;">Dear ${studentName},</h2>
          
          <p>Assalamu Alaikum wa Rahmatullahi wa Barakatuh,</p>
          
          <p>We regret to inform you that we are unable to approve your admission application at this time.</p>
          
          ${notes ? `<p><strong>Reason:</strong> ${notes}</p>` : ''}
          
          <p>We encourage you to reapply in the future.</p>
          
          <p>Jazakallahu Khairan,<br/><strong>Idarah Tarjamat-ul-Qur'an wa Sunnah</strong></p>
        </div>
      `;

    console.log(`Notification prepared for ${studentName} (${mobileNumber}), status: ${status}`);
    
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Idarah <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: subject,
        html: htmlContent,
      }),
    });

    const emailData = await emailRes.json();
    console.log("Email API response:", emailData);

    if (!emailRes.ok) {
      throw new Error(emailData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Notification sent for ${status} status`,
      emailId: emailData.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-admission-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
