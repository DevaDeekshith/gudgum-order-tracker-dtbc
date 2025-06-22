
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

    // Ensure order number starts with #GG
    const formattedOrderNumber = orderNumber.startsWith('#GG') ? orderNumber : `#GG${orderNumber}`;
    
    setIsLoading(true);
    console.log("Tracking order:", formattedOrderNumber);

    try {
      const response = await fetch('https://ultimate-n8n-sqfb.onrender.com/webhook/f2bec2d1-1817-40c6-a844-addb32372930', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: formattedOrderNumber,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received tracking data:", data);
      
      if (data && data.length > 0 && data[0].statusFlag) {
        onTrackingData(data[0]);
        toast({
          title: "Success",
          description: "Order tracking information retrieved successfully!",
        });
      } else {
        throw new Error("No tracking data found for this order");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve tracking information. Please check your order number and try again.",
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
            placeholder="Enter your order number (e.g., GG26099)"
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
