
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { trackShipment } from '../services/dtdcApi';
import { transformDTDCResponse, validateTrackingData } from '../utils/dtdcTransformer';

interface TrackingFormProps {
  onTrackingData: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ onTrackingData, isLoading, setIsLoading }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your tracking number",
        variant: "destructive",
      });
      return;
    }

    // Validate tracking number format (basic validation)
    const orderPattern = /^[A-Z0-9]{10,15}$/i;
    if (!orderPattern.test(orderNumber.trim())) {
      toast({
        title: "Invalid Format",
        description: "Please enter a valid tracking number (e.g., 9X234567890)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const submittedOrderNumber = orderNumber.trim();
    console.log("Tracking order with native DTDC API:", submittedOrderNumber);

    try {
      // Call native DTDC API
      const dtdcResponse = await trackShipment(submittedOrderNumber);
      
      // Transform response to match existing component expectations
      const transformedData = transformDTDCResponse(dtdcResponse);
      
      // Validate transformed data
      if (!validateTrackingData(transformedData)) {
        throw new Error("No valid tracking data found for this tracking number.");
      }

      // Check if the response indicates success and has tracking data
      if (transformedData.statusFlag && transformedData.trackHeader && transformedData.trackDetails) {
        // Verify this is actually tracking data (not an error response)
        if (transformedData.trackHeader.strShipmentNo || transformedData.trackHeader.strRefNo) {
          onTrackingData(transformedData);
          toast({
            title: "Success",
            description: `Tracking information retrieved for ${transformedData.trackHeader.strRefNo || transformedData.trackHeader.strShipmentNo}`,
          });
        } else {
          throw new Error("No valid tracking data found in response.");
        }
      } else {
        // Handle explicit error responses from the DTDC API
        const errorMessage = transformedData.errorDetails || "No tracking data found for this tracking number.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching tracking data from DTDC API:", error);
      
      // Enhanced error handling for DTDC API specific errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to DTDC tracking service. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (error.message.includes('DTDC API error')) {
        toast({
          title: "Service Error",
          description: "DTDC tracking service is temporarily unavailable. Please try again later.",
          variant: "destructive",
        });
      } else if (error.message.includes('Invalid response')) {
        toast({
          title: "Data Error",
          description: "Received invalid data from tracking service. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Tracking Error",
          description: error.message || "Failed to retrieve tracking information. Please check your tracking number and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="e.g., 9X234567890"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            className="h-14 md:h-16 text-lg md:text-xl bg-white/80 backdrop-blur-md border-2 border-white/50 shadow-xl focus:bg-white/90 focus:border-primary/50 transition-all duration-200 rounded-2xl px-6"
            disabled={isLoading}
            maxLength={15}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !orderNumber.trim()}
          className="w-full h-12 md:h-14 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-xl transition-all duration-200 rounded-2xl disabled:opacity-50"
        >
          {isLoading ? 'TRACKING...' : 'TRACK YOUR ORDER'}
        </Button>
      </form>
    </div>
  );
};

export default TrackingForm;
