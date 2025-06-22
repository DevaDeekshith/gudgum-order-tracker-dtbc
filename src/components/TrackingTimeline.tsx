
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Clock, Calendar, Package, Truck, CheckCircle, MapPin } from 'lucide-react';

interface TrackingDetail {
  strCode: string;
  strAction: string;
  strOrigin: string;
  strDestination: string;
  strActionDate: string;
  strActionTime: string;
  sTrRemarks: string;
  strManifestNo: string;
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

  const getStatusDetails = (action: string) => {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('softdata upload')) {
      return {
        color: 'bg-gradient-to-br from-purple-500 to-purple-700',
        icon: Upload,
        iconColor: 'text-white'
      };
    }
    if (actionLower.includes('pickup awaited')) {
      return {
        color: 'bg-gradient-to-br from-orange-500 to-red-500',
        icon: Clock,
        iconColor: 'text-white'
      };
    }
    if (actionLower.includes('pickup schedule')) {
      return {
        color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        icon: Calendar,
        iconColor: 'text-white'
      };
    }
    if (actionLower.includes('picked up')) {
      return {
        color: 'bg-gradient-to-br from-green-500 to-emerald-600',
        icon: Package,
        iconColor: 'text-white'
      };
    }
    if (actionLower.includes('delivered')) {
      return {
        color: 'bg-gradient-to-br from-green-600 to-green-800',
        icon: CheckCircle,
        iconColor: 'text-white'
      };
    }
    if (actionLower.includes('out for delivery')) {
      return {
        color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        icon: Truck,
        iconColor: 'text-white'
      };
    }
    if (actionLower.includes('transit')) {
      return {
        color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        icon: Package,
        iconColor: 'text-white'
      };
    }
    
    // Default
    return {
      color: 'bg-gradient-to-br from-gray-500 to-gray-700',
      icon: MapPin,
      iconColor: 'text-white'
    };
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'bg-secondary';
    if (statusLower.includes('out for delivery')) return 'bg-yellow-500';
    if (statusLower.includes('transit') || statusLower.includes('picked')) return 'bg-blue-500';
    if (statusLower.includes('booked')) return 'bg-purple-500';
    return 'bg-gray-400';
  };

  // Reverse the order to show latest first
  const reversedDetails = [...trackDetails].reverse();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Card */}
      <Card className="mb-8 bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-primary">ORDER DETAILS</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Order Number:</span> {trackHeader.strRefNo}</p>
                <p><span className="font-semibold">Tracking Number:</span> {trackHeader.strShipmentNo}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-white font-semibold ${getStatusColor(trackHeader.strStatus)}`}>
                    {trackHeader.strStatus.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-secondary">SHIPPING INFO</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">From:</span> {trackHeader.strOrigin}</p>
                <p><span className="font-semibold">To:</span> {trackHeader.strDestination}</p>
                <p><span className="font-semibold">Expected Delivery:</span> {formatDate(trackHeader.strExpectedDeliveryDate)}</p>
                {trackHeader.strRemarks && (
                  <p><span className="font-semibold">Delivered To:</span> {trackHeader.strRemarks}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-6 text-primary">TRACKING TIMELINE</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {reversedDetails.map((detail, index) => {
              const statusDetails = getStatusDetails(detail.strAction);
              const IconComponent = statusDetails.icon;
              
              return (
                <div key={index} className="relative flex items-start mb-8 last:mb-0">
                  {/* Timeline Dot with Icon */}
                  <div className={`relative z-10 w-16 h-16 rounded-full border-2 border-white ${statusDetails.color} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-8 h-8 ${statusDetails.iconColor}`} strokeWidth={2} />
                  </div>
                  
                  {/* Content */}
                  <div className="ml-6 flex-1">
                    <div className="p-4 bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h4 className="text-lg font-bold text-primary">{detail.strAction.toUpperCase()}</h4>
                        <div className="text-sm font-semibold bg-yellow-100 px-2 py-1 rounded inline-block">
                          {formatDate(detail.strActionDate)} at {formatTime(detail.strActionTime)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {detail.strOrigin && (
                          <p><span className="font-semibold">Location:</span> {detail.strOrigin}</p>
                        )}
                        {detail.strDestination && (
                          <p><span className="font-semibold">Destination:</span> {detail.strDestination}</p>
                        )}
                        {detail.strManifestNo && (
                          <p><span className="font-semibold">Manifest:</span> {detail.strManifestNo}</p>
                        )}
                        {detail.sTrRemarks && detail.sTrRemarks.trim() !== '' && detail.sTrRemarks !== '0.00' && (
                          <p><span className="font-semibold">Remarks:</span> {detail.sTrRemarks}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingTimeline;
