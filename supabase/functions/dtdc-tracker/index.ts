import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Restrict CORS in production - adjust origins as needed
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // TODO: Restrict to specific domains in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface DTDCTrackDetail {
  strCode: string;
  strAction: string;
  strOrigin: string;
  strDestination: string;
  strActionDate: string;
  strActionTime: string;
  sTrRemarks: string;
  strManifestNo: string;
}

interface DTDCTrackHeader {
  strShipmentNo: string;
  strRefNo: string;
  strOrigin: string;
  strDestination: string;
  strStatus: string;
  strStatusTransOn: string;
  strStatusTransTime: string;
  strRemarks: string;
  strBookedDate: string;
  strBookedTime: string;
  strExpectedDeliveryDate: string;
}

interface DTDCApiResponse {
  statusFlag: boolean;
  trackHeader: DTDCTrackHeader;
  trackDetails: DTDCTrackDetail[];
  errorDetails?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trackingNumber } = await req.json();
    
    // Enhanced input validation and sanitization
    if (!trackingNumber || typeof trackingNumber !== 'string') {
      return new Response(
        JSON.stringify({ 
          statusFlag: false, 
          errorDetails: 'Invalid tracking number format' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize tracking number - allow only alphanumeric characters
    const sanitizedTrackingNumber = trackingNumber.trim().replace(/[^a-zA-Z0-9]/g, '');
    
    if (sanitizedTrackingNumber.length < 5 || sanitizedTrackingNumber.length > 20) {
      return new Response(
        JSON.stringify({ 
          statusFlag: false, 
          errorDetails: 'Tracking number must be between 5-20 characters' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing tracking request for:', sanitizedTrackingNumber.substring(0, 3) + '***');

    const dtdcResponse = await fetch('https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Deno.env.get('DTDC_ACCESS_TOKEN') || 'BL12888_trk_json:0315a86f0505974a5106adaa40888fd1',
        'Cookie': Deno.env.get('DTDC_COOKIE') || 'cookiesession1=678A3F3D4DCAD2C68870A722D5E853D5',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        trkType: "cnno",
        strcnno: sanitizedTrackingNumber,
        addtnlDtl: "Y"
      })
    });

    console.log('DTDC API Response status:', dtdcResponse.status);

    if (!dtdcResponse.ok) {
      throw new Error(`DTDC API error (${dtdcResponse.status}): Service unavailable`);
    }

    const responseText = await dtdcResponse.text();
    // Log response without sensitive data
    console.log('DTDC API response received, length:', responseText.length);

    let data: DTDCApiResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('DTDC API JSON parse error');
      throw new Error('Invalid response format from DTDC API');
    }

    // Log success without exposing sensitive tracking details
    console.log('DTDC API response parsed successfully, statusFlag:', data.statusFlag);

    // Validate response structure
    if (!data || typeof data.statusFlag === 'undefined') {
      throw new Error('Invalid response structure from DTDC API');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error type:', error?.constructor?.name);
    
    // Return generic error message to prevent information disclosure
    return new Response(
      JSON.stringify({ 
        statusFlag: false,
        errorDetails: 'Unable to process tracking request. Please try again later.'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});