
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

    setIsLoading(true);
    console.log("Tracking order:", orderNumber);

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
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        console.error("HTTP error! status:", response.status, "text:", responseText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Response was not valid JSON:", responseText);
        throw new Error("Invalid JSON response from server");
      }
      
      console.log("Parsed tracking data:", data);
      
      // Check if the response indicates success and has tracking data
      if (data && data.statusFlag && data.trackHeader) {
        onTrackingData(data);
        toast({
          title: "Success",
          description: "Order tracking information retrieved successfully!",
        });
      } else {
        console.log("No valid tracking data found:", data);
        throw new Error("No tracking data found for this order");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      toast({
        title: "Error",
        description: `Failed to retrieve tracking information: ${error.message}`,
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
            onChange={(e) => setOrderNumber(e.target.value)}
            className="h-14 md:h-16 text-lg md:text-xl bg-white/80 backdrop-blur-md border-2 border-white/50 shadow-xl focus:bg-white/90 focus:border-primary/50 transition-all duration-200 rounded-2xl px-6"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 md:h-14 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-xl transition-all duration-200 rounded-2xl"
        >
          {isLoading ? 'TRACKING...' : 'TRACK YOUR ORDER'}
        </Button>
      </form>
    </div>
  );
};

export default TrackingForm;
