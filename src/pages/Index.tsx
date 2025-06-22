
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
        {/* Header - Centered */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex flex-col items-center justify-center">
            <AnimatedSplitText 
              text="GUD GUM"
              className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2 md:mb-4"
              delay={100}
              duration={0.8}
            />
            <div className="bg-white/20 backdrop-blur-xl text-slate-800 px-4 md:px-8 py-3 md:py-4 border border-white/30 shadow-xl rounded-2xl">
              <AnimatedSplitText 
                text="TRACK YOUR ORDER"
                className="text-lg md:text-xl lg:text-2xl font-semibold"
                delay={50}
                duration={0.6}
              />
            </div>
          </div>
        </div>

        {!trackingData ? (
          /* Bento Layout - Single column on mobile, grid on desktop */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Main tracking form - takes full width on mobile, 2 columns on desktop */}
            <div className="lg:col-span-2 order-1">
              <div className="bg-white/20 backdrop-blur-xl p-6 md:p-10 border border-white/30 shadow-2xl rounded-3xl h-full">
                <div className="text-center mb-6 md:mb-8">
                  <div className="text-5xl md:text-7xl mb-4 md:mb-6">📦</div>
                  <p className="text-base md:text-lg font-medium text-slate-700 leading-relaxed">
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
            
            {/* Side info cards - stacked on mobile, single column on desktop */}
            <div className="space-y-4 md:space-y-6 order-2">
              <div className="bg-white/15 backdrop-blur-xl p-4 md:p-6 border border-white/30 shadow-xl rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2">🚀</div>
                  <h3 className="font-semibold text-slate-800 mb-2">Fast Delivery</h3>
                  <p className="text-sm text-slate-600">Quick and reliable shipping</p>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-xl p-4 md:p-6 border border-white/30 shadow-xl rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2">🔒</div>
                  <h3 className="font-semibold text-slate-800 mb-2">Secure Tracking</h3>
                  <p className="text-sm text-slate-600">Real-time updates</p>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-xl p-4 md:p-6 border border-white/30 shadow-xl rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2">💬</div>
                  <h3 className="font-semibold text-slate-800 mb-2">24/7 Support</h3>
                  <p className="text-sm text-slate-600">Always here to help</p>
                </div>
              </div>
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
