
import React, { useState } from 'react';
import TrackingForm from '../components/TrackingForm';
import TrackingTimeline from '../components/TrackingTimeline';
import AnimatedSplitText from '../components/SplitText';

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

      <div className="container mx-auto py-4 md:py-8 px-4 relative z-10">
        {!trackingData ? (
          /* Google Search-like Layout */
          <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
            {/* Brand Logo */}
            <div className="text-center mb-12">
              <AnimatedSplitText 
                text="GUD GUM"
                className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                delay={100}
                duration={0.8}
              />
            </div>

            {/* Main Heading */}
            <div className="text-center mb-8">
              <AnimatedSplitText 
                text="We're here to help you track your order"
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight"
                delay={50}
                duration={0.6}
              />
              <p className="text-lg md:text-xl text-slate-600 font-medium">
                Simply enter your tracking number below and we'll show you exactly where your package is
              </p>
            </div>

            {/* Search Form */}
            <div className="w-full max-w-lg">
              <TrackingForm 
                onTrackingData={handleTrackingData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6 md:mb-8">
              <button
                onClick={resetTracking}
                className="bg-gradient-to-r from-primary to-emerald-600 backdrop-blur-xl text-white px-6 md:px-8 py-3 md:py-4 font-semibold border border-white/20 shadow-xl hover:from-primary/90 hover:to-emerald-700 transition-all duration-300 rounded-2xl transform hover:scale-105 hover:-translate-y-1"
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
