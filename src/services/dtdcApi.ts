
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
 * Track shipment using DTDC native API
 * @param trackingNumber - The tracking/consignment number to track
 * @returns Promise<DTDCApiResponse>
 */
export const trackShipment = async (trackingNumber: string): Promise<DTDCApiResponse> => {
  console.log('Tracking shipment with DTDC native API:', trackingNumber);
  
  const requestBody: TrackShipmentRequest = {
    trkType: "cnno",
    strcnno: trackingNumber.trim(),
    addtnlDtl: "Y"
  };

  console.log('DTDC API Request body:', JSON.stringify(requestBody, null, 2));
  console.log('DTDC API URL:', DTDC_CONFIG.apiUrl);

  try {
    const response = await fetch(DTDC_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': DTDC_CONFIG.accessToken,
        'Cookie': DTDC_CONFIG.cookie,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('DTDC API Response status:', response.status);
    console.log('DTDC API Response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`DTDC API error (${response.status}): ${response.statusText}`);
    }

    const responseText = await response.text();
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

    return data;
  } catch (error) {
    console.error('DTDC API Error:', error);
    throw error;
  }
};
