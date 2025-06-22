
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

      const response = await fetch('https://ultimate-n8n-sqfb.onrender.com/webhook-test/f2bec2d1-1817-40c6-a844-addb32372930', {
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
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter your order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="h-14 text-lg bg-white/20 backdrop-blur-md border border-white/30 shadow-lg focus:bg-white/30 focus:border-white/50 transition-all duration-200"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg backdrop-blur-md transition-all duration-200"
        >
          {isLoading ? 'TRACKING...' : 'TRACK YOUR ORDER'}
        </Button>
      </form>
    </div>
  );
};

export default TrackingForm;
