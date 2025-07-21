
// DTDC API Response Interfaces
export interface DTDCTrackDetail {
  strCode: string;
  strAction: string;
  strOrigin: string;
  strDestination: string;
  strActionDate: string;
  strActionTime: string;
  sTrRemarks: string;
  strManifestNo: string;
}

export interface DTDCTrackHeader {
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

export interface DTDCApiResponse {
  statusFlag: boolean;
  trackHeader: DTDCTrackHeader;
  trackDetails: DTDCTrackDetail[];
  errorDetails?: string;
}

export interface TrackShipmentRequest {
  trkType: string;
  strcnno: string;
  addtnlDtl: string;
}

// DTDC API Configuration
const DTDC_CONFIG = {
  apiUrl: 'https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails',
  accessToken: 'BL12888_trk_json:0315a86f0505974a5106adaa40888fd1',
  cookie: 'cookiesession1=678A3F3D4DCAD2C68870A722D5E853D5'
};

/**
 * Track shipment using Supabase Edge Function (secure backend proxy)
 * @param trackingNumber - The tracking/consignment number to track
 * @returns Promise<DTDCApiResponse>
 */
export const trackShipment = async (trackingNumber: string): Promise<DTDCApiResponse> => {
  console.log('Tracking shipment via Supabase Edge Function:', trackingNumber);

  try {
    // Input validation and sanitization
    const sanitizedTrackingNumber = trackingNumber.trim().replace(/[^a-zA-Z0-9]/g, '');
    
    if (!sanitizedTrackingNumber || sanitizedTrackingNumber.length < 5 || sanitizedTrackingNumber.length > 20) {
      throw new Error('Invalid tracking number format');
    }

    const response = await fetch('https://kgtjdbyzxaearguhvrja.supabase.co/functions/v1/dtdc-tracker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtndGpkYnl6eGFlYXJndWh2cmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTIyNzAsImV4cCI6MjA2NjE4ODI3MH0.m_8lQ2ohMPzoUs5-zSyneI5ACdl-yX0XyjI_j_dUN0g`
      },
      body: JSON.stringify({ trackingNumber: sanitizedTrackingNumber })
    });

    console.log('Edge Function Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function Error - Status:', response.status);
      throw new Error(`Tracking service error (${response.status}): Unable to connect to tracking service`);
    }

    const responseText = await response.text();
    console.log('Edge Function response received successfully');

    let data: DTDCApiResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Edge Function JSON parse error:', parseError);
      throw new Error('Invalid response format from tracking service');
    }

    console.log('Edge Function response parsed successfully');

    // Validate response structure
    if (!data || typeof data.statusFlag === 'undefined') {
      throw new Error('Invalid response structure from tracking service');
    }

    return data;
  } catch (error) {
    console.error('Tracking Service Error:', error);
    throw error;
  }
};
