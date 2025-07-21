import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    if (!trackingNumber) {
      return new Response(
        JSON.stringify({ error: 'Tracking number is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Tracking shipment via edge function:', trackingNumber);

    const dtdcResponse = await fetch('https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': 'BL12888_trk_json:0315a86f0505974a5106adaa40888fd1',
        'Cookie': 'cookiesession1=678A3F3D4DCAD2C68870A722D5E853D5',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        trkType: "cnno",
        strcnno: trackingNumber.trim(),
        addtnlDtl: "Y"
      })
    });

    console.log('DTDC API Response status:', dtdcResponse.status);

    if (!dtdcResponse.ok) {
      throw new Error(`DTDC API error (${dtdcResponse.status}): ${dtdcResponse.statusText}`);
    }

    const responseText = await dtdcResponse.text();
    console.log('DTDC API Raw response:', responseText);

    let data: DTDCApiResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('DTDC API JSON parse error:', parseError);
      throw new Error('Invalid response format from DTDC API');
    }

    console.log('DTDC API Parsed response:', data);

    // Validate response structure
    if (!data || typeof data.statusFlag === 'undefined') {
      throw new Error('Invalid response structure from DTDC API');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unable to track shipment'
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});