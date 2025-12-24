import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Normalize Urdu/Arabic text for better searchability
function normalizeUrduText(text: string): string {
  if (!text) return '';
  
  // Normalize various forms of similar characters
  let normalized = text
    // Normalize alef variations
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize yaa variations
    .replace(/[ىئ]/g, 'ی')
    // Normalize kaf variations  
    .replace(/ك/g, 'ک')
    // Normalize haa variations
    .replace(/ة/g, 'ہ')
    // Remove diacritics (tashkeel) for searching
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize spaces and newlines
    .replace(/\s+/g, ' ')
    .trim();
  
  return normalized;
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
    console.error('Token exchange failed:', tokenData);
    throw new Error('Failed to get access token');
  }

  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageUrl, pageNumber } = await req.json();
    
    console.log(`OCR request received for page: ${pageNumber || 'unknown'}`);

    if (!imageBase64 && !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Either imageBase64 or imageUrl is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }

    const serviceAccount = JSON.parse(serviceAccountKey);
    const accessToken = await getAccessToken(serviceAccount);

    let imageContent: any = {};
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      imageContent = { content: base64Data };
    } else if (imageUrl) {
      imageContent = { source: { imageUri: imageUrl } };
    }

    const visionRequest = {
      requests: [
        {
          image: imageContent,
          features: [
            { type: 'DOCUMENT_TEXT_DETECTION' }
          ],
          imageContext: {
            languageHints: ['ur', 'ar', 'fa', 'en'] // Urdu, Arabic, Persian, English
          }
        }
      ]
    };

    console.log('Calling Google Cloud Vision API...');

    const visionResponse = await fetch(
      'https://vision.googleapis.com/v1/images:annotate',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visionRequest),
      }
    );

    const visionResult = await visionResponse.json();
    
    if (visionResult.error) {
      console.error('Vision API error:', visionResult.error);
      throw new Error(visionResult.error.message || 'Vision API error');
    }

    const response = visionResult.responses?.[0];
    
    if (!response) {
      console.log('No response from Vision API');
      return new Response(
        JSON.stringify({ 
          success: true, 
          text: '', 
          normalizedText: '',
          pageNumber,
          message: 'No text detected in the image' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get full text from document detection
    const fullText = response.fullTextAnnotation?.text || '';
    const textAnnotations = response.textAnnotations || [];
    const rawText = fullText || textAnnotations[0]?.description || '';
    
    // Normalize for search
    const normalizedText = normalizeUrduText(rawText);

    // Get detected languages
    const detectedLanguages = response.fullTextAnnotation?.pages?.[0]?.property?.detectedLanguages || [];

    console.log(`OCR completed for page ${pageNumber}. Text length: ${rawText.length}, Normalized: ${normalizedText.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        text: rawText,
        normalizedText: normalizedText,
        pageNumber,
        detectedLanguages: detectedLanguages.map((lang: any) => ({
          language: lang.languageCode,
          confidence: lang.confidence
        })),
        wordCount: textAnnotations.length > 1 ? textAnnotations.length - 1 : 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OCR extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
