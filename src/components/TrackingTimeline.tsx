
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TrackingDetail {
  strCode: string;
  strAction: string;
  strOrigin: string;
  strDestination: string;
  strActionDate: string;
  strActionTime: string;
  sTrRemarks: string;
}

interface TrackingHeader {
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

interface TrackingTimelineProps {
  trackHeader: TrackingHeader;
  trackDetails: TrackingDetail[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ trackHeader, trackDetails }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr.length < 3) return timeStr;
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'bg-secondary';
    if (statusLower.includes('out for delivery')) return 'bg-neubrutalism-yellow';
    if (statusLower.includes('transit') || statusLower.includes('picked')) return 'bg-neubrutalism-blue';
    if (statusLower.includes('booked')) return 'bg-neubrutalism-purple';
    return 'bg-gray-400';
  };

  const getStatusIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('delivered')) return '✅';
    if (actionLower.includes('out for delivery')) return '🚚';
    if (actionLower.includes('transit')) return '📦';
    if (actionLower.includes('picked')) return '📋';
    if (actionLower.includes('booked')) return '📝';
    return '📍';
  };

  // Reverse the order to show latest first
  const reversedDetails = [...trackDetails].reverse();

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Header Card */}
      <Card className="mb-8 border-4 border-black shadow-neubrutalism-lg bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-black mb-4 text-primary">ORDER DETAILS</h2>
              <div className="space-y-2">
                <p><span className="font-bold">Order Number:</span> {trackHeader.strRefNo}</p>
                <p><span className="font-bold">Tracking Number:</span> {trackHeader.strShipmentNo}</p>
                <p><span className="font-bold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-white font-bold ${getStatusColor(trackHeader.strStatus)}`}>
                    {trackHeader.strStatus.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black mb-4 text-secondary">SHIPPING INFO</h3>
              <div className="space-y-2">
                <p><span className="font-bold">From:</span> {trackHeader.strOrigin}</p>
                <p><span className="font-bold">To:</span> {trackHeader.strDestination}</p>
                <p><span className="font-bold">Expected Delivery:</span> {formatDate(trackHeader.strExpectedDeliveryDate)}</p>
                {trackHeader.strRemarks && (
                  <p><span className="font-bold">Delivered To:</span> {trackHeader.strRemarks}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-4 border-black shadow-neubrutalism-lg bg-white">
        <CardContent className="p-6">
          <h3 className="text-2xl font-black mb-6 text-primary">TRACKING TIMELINE</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-black"></div>
            
            {reversedDetails.map((detail, index) => (
              <div key={index} className="relative flex items-start mb-8 last:mb-0">
                {/* Timeline Dot */}
                <div className={`relative z-10 w-16 h-16 rounded-full border-4 border-black ${getStatusColor(detail.strAction)} flex items-center justify-center text-2xl shadow-neubrutalism`}>
                  {getStatusIcon(detail.strAction)}
                </div>
                
                {/* Content */}
                <div className="ml-6 flex-1">
                  <div className={`p-4 border-4 border-black shadow-neubrutalism bg-white ${index === 0 ? 'animate-bounce-in' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="text-lg font-black text-primary">{detail.strAction.toUpperCase()}</h4>
                      <div className="text-sm font-bold bg-neubrutalism-yellow px-2 py-1 border-2 border-black inline-block">
                        {formatDate(detail.strActionDate)} at {formatTime(detail.strActionTime)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {detail.strOrigin && (
                        <p><span className="font-bold">Location:</span> {detail.strOrigin}</p>
                      )}
                      {detail.strDestination && (
                        <p><span className="font-bold">Destination:</span> {detail.strDestination}</p>
                      )}
                      {detail.strManifestNo && (
                        <p><span className="font-bold">Manifest:</span> {detail.strManifestNo}</p>
                      )}
                      {detail.sTrRemarks && detail.sTrRemarks.trim() !== '' && detail.sTrRemarks !== '0.00' && (
                        <p><span className="font-bold">Remarks:</span> {detail.sTrRemarks}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingTimeline;
