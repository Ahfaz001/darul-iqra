import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, targetLanguages } = await req.json();
    
    if (!content) {
      throw new Error('Content is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Translating exam content to:', targetLanguages);

    const systemPrompt = `You are an expert translator specializing in Islamic educational content. Your task is to translate exam questions accurately while preserving:
1. Islamic terminology and proper transliteration
2. Question structure and formatting
3. Quranic verses and Hadith references in their original Arabic with translations
4. Educational context and meaning

IMPORTANT RULES:
- For English: Provide clear, academic English translation
- For Roman Urdu: Use proper Roman Urdu transliteration (not Hindi)
- Keep Arabic text (Quranic verses, Hadith) as-is but provide translation
- Maintain question numbering and structure
- Preserve marks allocation

Return a JSON object with this exact structure:
{
  "questions": [
    {
      "question_number": 1,
      "text_ur": "original Urdu text",
      "text_en": "English translation",
      "text_roman": "Roman Urdu transliteration",
      "marks": number,
      "type": "fill_blank" | "short_answer" | "long_answer"
    }
  ],
  "exam_title_ur": "title in Urdu",
  "exam_title_en": "title in English",
  "exam_title_roman": "title in Roman Urdu",
  "total_marks": number
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please translate and parse this Urdu exam paper into structured format with English and Roman Urdu translations:\n\n${content}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI Response received, parsing JSON...');

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = aiResponse;
    const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsedContent = JSON.parse(jsonStr);
    
    console.log('Translation successful, questions count:', parsedContent.questions?.length);

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Translation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
