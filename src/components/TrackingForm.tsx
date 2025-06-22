
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
    console.log("Tracking order:", orderNumber.trim());

    try {
      const requestBody = {
        orderNumber: orderNumber.trim(),
        timestamp: new Date().toISOString(),
      };
      
      console.log("Sending POST request to webhook");
      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://ultimate-n8n-sqfb.onrender.com/webhook/f2bec2d1-1817-40c6-a844-addb32372930', {
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
      
      // Check if the response indicates success and has tracking data
      if (data && data.statusFlag && data.trackHeader && data.trackDetails) {
        onTrackingData(data);
        toast({
          title: "Success",
          description: "Order tracking information retrieved successfully!",
        });
      } else if (data && !data.statusFlag) {
        throw new Error(data.errorDetails || "No tracking data found for this order number.");
      } else {
        throw new Error("No tracking data found for this order number. Please verify your tracking number.");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      toast({
        title: "Tracking Error",
        description: error.message || "Failed to retrieve tracking information. Please check your tracking number and try again.",
        variant: "destructive",
      });
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
