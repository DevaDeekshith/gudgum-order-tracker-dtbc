
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Glassmorphic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <SplitText 
            text="GUD GUM"
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            delay={100}
            duration={0.8}
          />
          <div className="mt-6 bg-white/20 backdrop-blur-xl text-slate-800 px-8 py-4 border border-white/30 shadow-xl inline-block rounded-2xl">
            <SplitText 
              text="TRACK YOUR ORDER"
              className="text-xl md:text-2xl font-semibold"
              delay={50}
              duration={0.6}
            />
          </div>
        </div>

        {!trackingData ? (
          <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur-xl p-10 border border-white/30 shadow-2xl max-w-md w-full rounded-3xl">
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">📦</div>
                <p className="text-lg font-medium text-slate-700 leading-relaxed">
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
                className="bg-gradient-to-r from-indigo-500 to-purple-600 backdrop-blur-xl text-white px-8 py-4 font-semibold border border-white/20 shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1"
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
      </div>
    </div>
  );
};

export default Index;
