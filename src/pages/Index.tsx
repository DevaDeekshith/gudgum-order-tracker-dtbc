
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
    <div className="min-h-screen bg-gradient-to-br from-neubrutalism-yellow via-white to-neubrutalism-pink p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black text-primary mb-4 transform -rotate-1 animate-bounce-in">
            GUD GUM
          </h1>
          <div className="bg-secondary text-white px-6 py-3 border-4 border-black shadow-neubrutalism-lg inline-block transform rotate-1">
            <h2 className="text-2xl md:text-3xl font-black">TRACK YOUR ORDER</h2>
          </div>
        </div>

        {!trackingData ? (
          <div className="flex flex-col items-center">
            <div className="bg-white p-8 border-4 border-black shadow-neubrutalism-lg max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg font-bold text-gray-700">
                  Enter your order number to track your Gud Gum delivery!
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
                className="bg-primary text-white px-6 py-3 font-black border-4 border-black shadow-neubrutalism hover:shadow-neubrutalism-lg transition-all duration-200 transform hover:-translate-y-1"
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
          <div className="bg-black text-white px-4 py-2 border-4 border-black shadow-neubrutalism inline-block">
            <p className="font-bold">Need help? Contact our support team!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
