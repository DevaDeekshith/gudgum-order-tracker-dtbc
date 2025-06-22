import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Clock, Calendar, Package, Truck, CheckCircle, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedSplitText from './SplitText';

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
  const [isTransitExpanded, setIsTransitExpanded] = useState(false);

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
        color: 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700',
        icon: Upload,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]'
      };
    }
    if (actionLower.includes('pickup awaited')) {
      return {
        color: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
        icon: Clock,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.6)]'
      };
    }
    if (actionLower.includes('pickup schedule')) {
      return {
        color: 'bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600',
        icon: Calendar,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]'
      };
    }
    if (actionLower.includes('picked up')) {
      return {
        color: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600',
        icon: Package,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]'
      };
    }
    if (actionLower.includes('delivered')) {
      return {
        color: 'bg-gradient-to-br from-green-500 via-emerald-600 to-green-700',
        icon: CheckCircle,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(34,197,94,0.8)]'
      };
    }
    if (actionLower.includes('out for delivery')) {
      return {
        color: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600',
        icon: Truck,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.7)]'
      };
    }
    if (actionLower.includes('transit')) {
      return {
        color: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700',
        icon: Package,
        iconColor: 'text-white',
        shadow: 'shadow-[0_0_40px_rgba(99,102,241,0.6)]'
      };
    }
    
    return {
      color: 'bg-gradient-to-br from-slate-500 via-gray-600 to-zinc-700',
      icon: MapPin,
      iconColor: 'text-white',
      shadow: 'shadow-[0_0_40px_rgba(100,116,139,0.5)]'
    };
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'bg-gradient-to-r from-emerald-500 to-green-600';
    if (statusLower.includes('out for delivery')) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    if (statusLower.includes('transit') || statusLower.includes('picked')) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    if (statusLower.includes('booked')) return 'bg-gradient-to-r from-purple-500 to-violet-600';
    return 'bg-gradient-to-r from-gray-400 to-slate-500';
  };

  // Group transit nodes and reverse the order
  const reversedDetails = [...trackDetails].reverse();
  const transitNodes = reversedDetails.filter(detail => 
    detail.strAction.toLowerCase().includes('transit')
  );
  const nonTransitNodes = reversedDetails.filter(detail => 
    !detail.strAction.toLowerCase().includes('transit')
  );

  const renderTimelineNode = (detail: TrackingDetail, index: number, isNested = false) => {
    const statusDetails = getStatusDetails(detail.strAction);
    const IconComponent = statusDetails.icon;
    
    return (
      <div key={index} className={`relative flex items-start ${isNested ? 'ml-8 mb-4' : 'mb-12'} last:mb-0`}>
        {/* Timeline Dot with Icon */}
        <div className={`relative z-10 ${isNested ? 'w-12 h-12' : 'w-20 h-20'} rounded-2xl backdrop-blur-xl border border-white/30 ${statusDetails.color} ${statusDetails.shadow} flex items-center justify-center transform hover:scale-110 transition-all duration-500 hover:rotate-3`}>
          <IconComponent className={`${isNested ? 'w-6 h-6' : 'w-10 h-10'} ${statusDetails.iconColor}`} strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm"></div>
        </div>
        
        {/* Content */}
        <div className={`${isNested ? 'ml-4' : 'ml-8'} flex-1`}>
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/15 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] hover:-translate-y-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <h4 className={`${isNested ? 'text-base' : 'text-xl'} font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent`}>
                {detail.strAction.toUpperCase()}
              </h4>
              <div className="text-sm font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                {formatDate(detail.strActionDate)} at {formatTime(detail.strActionTime)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-slate-700">
              {detail.strOrigin && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Location:</span> 
                  <span className="bg-slate-100/80 px-3 py-1 rounded-full">{detail.strOrigin}</span>
                </p>
              )}
              {detail.strDestination && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Destination:</span> 
                  <span className="bg-slate-100/80 px-3 py-1 rounded-full">{detail.strDestination}</span>
                </p>
              )}
              {detail.strManifestNo && (
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Manifest:</span> 
                  <span className="bg-slate-100/80 px-3 py-1 rounded-full">{detail.strManifestNo}</span>
                </p>
              )}
              {detail.sTrRemarks && detail.sTrRemarks.trim() !== '' && detail.sTrRemarks !== '0.00' && (
                <p className="flex items-center gap-2 lg:col-span-2">
                  <span className="font-semibold text-slate-800">Remarks:</span> 
                  <span className="bg-slate-100/80 px-3 py-1 rounded-full">{detail.sTrRemarks}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      {/* Header Card */}
      <Card className="mb-12 bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <AnimatedSplitText 
              text="ORDER DETAILS"
              className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
              delay={50}
              duration={0.8}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Order Information</h3>
                <div className="space-y-3">
                  <p className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Order Number:</span> 
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-mono">{trackHeader.strRefNo}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Tracking Number:</span> 
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-mono">{trackHeader.strShipmentNo}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Status:</span>
                    <span className={`px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg ${getStatusColor(trackHeader.strStatus)}`}>
                      {trackHeader.strStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Shipping Information</h3>
                <div className="space-y-3">
                  <p className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">From:</span> 
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">{trackHeader.strOrigin}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">To:</span> 
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">{trackHeader.strDestination}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Expected Delivery:</span> 
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">{formatDate(trackHeader.strExpectedDeliveryDate)}</span>
                  </p>
                  {trackHeader.strRemarks && (
                    <p className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">Delivered To:</span> 
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">{trackHeader.strRemarks}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <AnimatedSplitText 
              text="TRACKING TIMELINE"
              className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
              delay={50}
              duration={0.8}
            />
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 rounded-full opacity-60"></div>
            
            {/* Render non-transit nodes first */}
            {nonTransitNodes.map((detail, index) => renderTimelineNode(detail, index))}
            
            {/* Render grouped transit nodes */}
            {transitNodes.length > 0 && (
              <div className="relative flex items-start mb-12 last:mb-0">
                {/* Main Transit Icon */}
                <div className="relative z-10 w-20 h-20 rounded-2xl backdrop-blur-xl border border-white/30 bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 shadow-[0_0_40px_rgba(99,102,241,0.6)] flex items-center justify-center transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                  <Package className="w-10 h-10 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm"></div>
                </div>
                
                {/* Transit Content */}
                <div className="ml-8 flex-1">
                  <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/15 transition-all duration-500">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsTransitExpanded(!isTransitExpanded)}
                    >
                      <h4 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        IN TRANSIT ({transitNodes.length} UPDATES)
                      </h4>
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                        {isTransitExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-700" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-700" />
                        )}
                      </div>
                    </div>
                    
                    {isTransitExpanded && (
                      <div className="mt-6 space-y-4 animate-slide-up">
                        <div className="relative">
                          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-purple-300 rounded-full opacity-50"></div>
                          {transitNodes.map((detail, index) => renderTimelineNode(detail, index, true))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingTimeline;
