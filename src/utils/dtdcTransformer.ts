
import { DTDCApiResponse, DTDCTrackDetail, DTDCTrackHeader } from '../services/dtdcApi';

// Interfaces matching the existing TrackingTimeline component expectations
export interface TransformedTrackDetail {
  strCode: string;
  strAction: string;
  strOrigin: string;
  strDestination: string;
  strActionDate: string;
  strActionTime: string;
  sTrRemarks: string;
  strManifestNo: string;
}

export interface TransformedTrackHeader {
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

export interface TransformedTrackingData {
  statusFlag: boolean;
  trackHeader: TransformedTrackHeader;
  trackDetails: TransformedTrackDetail[];
  errorDetails?: string;
}

/**
 * Transform DTDC API response to match existing component expectations
 * @param dtdcResponse - Raw response from DTDC API
 * @returns TransformedTrackingData - Data formatted for existing components
 */
export const transformDTDCResponse = (dtdcResponse: DTDCApiResponse): TransformedTrackingData => {
  console.log('Transforming DTDC response:', dtdcResponse);

  // Handle error responses
  if (!dtdcResponse.statusFlag) {
    return {
      statusFlag: false,
      trackHeader: {} as TransformedTrackHeader,
      trackDetails: [],
      errorDetails: dtdcResponse.errorDetails || 'No tracking data found'
    };
  }

  // Validate required data
  if (!dtdcResponse.trackHeader || !dtdcResponse.trackDetails) {
    throw new Error('Missing required tracking data in DTDC response');
  }

  // Transform header data (direct mapping as structure should be compatible)
  const transformedHeader: TransformedTrackHeader = {
    strShipmentNo: dtdcResponse.trackHeader.strShipmentNo || '',
    strRefNo: dtdcResponse.trackHeader.strRefNo || '',
    strOrigin: dtdcResponse.trackHeader.strOrigin || '',
    strDestination: dtdcResponse.trackHeader.strDestination || '',
    strStatus: dtdcResponse.trackHeader.strStatus || '',
    strStatusTransOn: dtdcResponse.trackHeader.strStatusTransOn || '',
    strStatusTransTime: dtdcResponse.trackHeader.strStatusTransTime || '',
    strRemarks: dtdcResponse.trackHeader.strRemarks || '',
    strBookedDate: dtdcResponse.trackHeader.strBookedDate || '',
    strBookedTime: dtdcResponse.trackHeader.strBookedTime || '',
    strExpectedDeliveryDate: dtdcResponse.trackHeader.strExpectedDeliveryDate || ''
  };

  // Transform tracking details (direct mapping as structure should be compatible)
  const transformedDetails: TransformedTrackDetail[] = dtdcResponse.trackDetails.map(detail => ({
    strCode: detail.strCode || '',
    strAction: detail.strAction || '',
    strOrigin: detail.strOrigin || '',
    strDestination: detail.strDestination || '',
    strActionDate: detail.strActionDate || '',
    strActionTime: detail.strActionTime || '',
    sTrRemarks: detail.sTrRemarks || '',
    strManifestNo: detail.strManifestNo || ''
  }));

  const transformedData: TransformedTrackingData = {
    statusFlag: true,
    trackHeader: transformedHeader,
    trackDetails: transformedDetails
  };

  console.log('Transformed tracking data:', transformedData);
  return transformedData;
};

/**
 * Validate that required tracking data exists
 * @param data - Transformed tracking data
 * @returns boolean - Whether data is valid for display
 */
export const validateTrackingData = (data: TransformedTrackingData): boolean => {
  if (!data.statusFlag) {
    return false;
  }

  // Check for essential header data
  const hasValidHeader = data.trackHeader && 
    (data.trackHeader.strShipmentNo || data.trackHeader.strRefNo);

  // Check for tracking details
  const hasTrackingDetails = data.trackDetails && data.trackDetails.length > 0;

  return hasValidHeader && hasTrackingDetails;
};
