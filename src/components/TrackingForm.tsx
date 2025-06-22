
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter your order number (e.g., GG26099)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="h-16 text-lg font-bold border-4 border-black shadow-neubrutalism focus:shadow-neubrutalism-lg transition-all duration-200 bg-white"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">
            #GG
          </div>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 text-white border-4 border-black shadow-neubrutalism hover:shadow-neubrutalism-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          {isLoading ? 'TRACKING...' : 'TRACK YOUR ORDER'}
        </Button>
      </form>
    </div>
  );
};

export default TrackingForm;
