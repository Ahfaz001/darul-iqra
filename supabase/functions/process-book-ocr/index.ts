import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Normalize Urdu/Arabic text for better searchability
function normalizeUrduText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىئ]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ہ')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

// Get access token using service account
async function getAccessToken(serviceAccount: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-vision",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: exp
  };

  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedToken = `${headerB64}.${payloadB64}`;

  const pemContents = serviceAccount.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');
  
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    bytes.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${unsignedToken}.${signatureB64}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  
  if (!tokenData.access_token) {
    throw new Error('Failed to get access token');
  }

  return tokenData.access_token;
}

// OCR a single image
async function ocrImage(imageBase64: string, accessToken: string): Promise<string> {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  
  const visionRequest = {
    requests: [{
      image: { content: base64Data },
      features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
      imageContext: { languageHints: ['ur', 'ar', 'fa', 'en'] }
    }]
  };

  const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visionRequest),
  });

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error.message || 'Vision API error');
  }

  return result.responses?.[0]?.fullTextAnnotation?.text || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookId, pageImages, totalPages } = await req.json();
    
    console.log(`Starting OCR for book ${bookId}, processing ${pageImages?.length || 0} pages`);

    if (!bookId || !pageImages || pageImages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'bookId and pageImages are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const serviceAccount = JSON.parse(serviceAccountKey);
    const accessToken = await getAccessToken(serviceAccount);

    let processedCount = 0;
    const results: { pageNumber: number; success: boolean; textLength: number }[] = [];

    for (const pageData of pageImages) {
      const { pageNumber, imageBase64 } = pageData;
      
      try {
        console.log(`Processing page ${pageNumber}...`);
        
        const text = await ocrImage(imageBase64, accessToken);
        const normalizedText = normalizeUrduText(text);
        
        // Upsert page text
        const { error: upsertError } = await supabase
          .from('book_pages')
          .upsert({
            book_id: bookId,
            page_number: pageNumber,
            text_content: text,
            normalized_text: normalizedText,
          }, {
            onConflict: 'book_id,page_number'
          });

        if (upsertError) {
          console.error(`Error saving page ${pageNumber}:`, upsertError);
          results.push({ pageNumber, success: false, textLength: 0 });
        } else {
          results.push({ pageNumber, success: true, textLength: text.length });
          processedCount++;
        }

        // Update book ocr_pages_done
        await supabase
          .from('books')
          .update({ 
            ocr_pages_done: processedCount,
            ocr_status: processedCount >= totalPages ? 'completed' : 'processing'
          })
          .eq('id', bookId);

      } catch (pageError) {
        console.error(`OCR error for page ${pageNumber}:`, pageError);
        results.push({ pageNumber, success: false, textLength: 0 });
      }
    }

    console.log(`OCR completed for book ${bookId}. Processed ${processedCount}/${pageImages.length} pages`);

    return new Response(
      JSON.stringify({
        success: true,
        bookId,
        processedCount,
        totalPages: pageImages.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Process book OCR error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
