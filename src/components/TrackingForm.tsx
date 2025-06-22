
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
        description: "Please enter your order number",
        variant: "destructive",
      });
      return;
    }

    // Validate order number format (basic validation)
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
    console.log("Tracking order:", submittedOrderNumber);

    try {
      const requestBody = {
        orderNumber: submittedOrderNumber,
        timestamp: new Date().toISOString(),
      };
      
      console.log("Sending POST request to test webhook");
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      console.log("Test Webhook URL:", 'https://ultimate-n8n-sqfb.onrender.com/webhook-test/f2bec2d1-1817-40c6-a844-addb32372930');

      const response = await fetch('https://ultimate-n8n-sqfb.onrender.com/webhook-test/f2bec2d1-1817-40c6-a844-addb32372930', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found. Please check your tracking number and try again.");
        } else if (response.status === 400) {
          throw new Error("Invalid tracking number format. Please enter a valid tracking number.");
        } else {
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }
      
      console.log("Parsed tracking data:", data);
      console.log("Submitted order number:", submittedOrderNumber);
      console.log("Response tracking number:", data?.trackHeader?.strShipmentNo);
      
      // Check if the response indicates success and has tracking data
      if (data && data.statusFlag && data.trackHeader && data.trackDetails) {
        // Verify this is actually tracking data (not an error response)
        if (data.trackHeader.strShipmentNo || data.trackHeader.strRefNo) {
          onTrackingData(data);
          toast({
            title: "Success",
            description: `Order tracking information retrieved for ${data.trackHeader.strRefNo || data.trackHeader.strShipmentNo}`,
          });
        } else {
          throw new Error("No valid tracking data found in response.");
        }
      } else if (data && !data.statusFlag) {
        // Handle explicit error responses from the webhook
        const errorMessage = data.errorDetails || "No tracking data found for this order number.";
        throw new Error(errorMessage);
      } else {
        // Handle missing or invalid data structure
        throw new Error("No tracking data found for this order number. Please verify your tracking number and try again.");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to tracking service. Please check your internet connection and try again.",
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
