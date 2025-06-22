
import React, { useState } from 'react';
import TrackingForm from '../components/TrackingForm';
import TrackingTimeline from '../components/TrackingTimeline';

const Index = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackingData = (data: any) => {
    console.log("Setting tracking data:", data);
    setTrackingData(data);
  };

  const resetTracking = () => {
    setTrackingData(null);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">
            GUD GUM
          </h1>
          <div className="bg-secondary/90 backdrop-blur-md text-white px-6 py-3 border border-white/20 shadow-lg inline-block rounded-lg">
            <h2 className="text-xl md:text-2xl font-semibold">TRACK YOUR ORDER</h2>
          </div>
        </div>

        {!trackingData ? (
          <div className="flex flex-col items-center">
            <div className="bg-white/40 backdrop-blur-md p-8 border border-white/30 shadow-xl max-w-md w-full rounded-xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg font-medium text-gray-700">
                  Enter your order number to track your Gud Gum delivery
                </p>
              </div>
              <TrackingForm 
                onTrackingData={handleTrackingData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={resetTracking}
                className="bg-primary/90 backdrop-blur-md text-white px-6 py-3 font-semibold border border-white/20 shadow-lg hover:bg-primary transition-all duration-200 rounded-lg"
              >
                TRACK ANOTHER ORDER
              </button>
            </div>
            <TrackingTimeline 
              trackHeader={trackingData.trackHeader}
              trackDetails={trackingData.trackDetails}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 shadow-lg inline-block rounded-lg">
            <p className="font-medium">Need help? Contact our support team!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
