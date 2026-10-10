import React, { useState } from 'react';
import { Bot, Sparkles, Send, ArrowRight, CornerDownLeft, ShieldCheck, Check } from 'lucide-react';
import { AI_QUICK_PROMPTS } from '../data/mockData';

export function AiAssistantSection({ onExploreListings }) {
  const [activeQuery, setActiveQuery] = useState(AI_QUICK_PROMPTS[0]);
  const [inputVal, setInputVal] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(
    "Got you. I found 4 options within 2 km of IET-DAVV. Two include food and have verified resident reviews. 'Campus View PG' is 700m away with 2 beds left at ₹6,500/month."
  );

  const sampleResponses = {
    [AI_QUICK_PROMPTS[0]]: "Got you. I found 4 options within 2 km of IET-DAVV. Two include food and have verified resident reviews. 'Campus View PG' is 700m away with 2 beds left at ₹6,500/month.",
    [AI_QUICK_PROMPTS[1]]: "For Bhawarkua, 'Maa’s Kitchen' and 'Sharmaji Swad' are the top rated. Maa's Kitchen offers ₹2,500/mo unlimited thali, pure veg, and delivers within 15 minutes of ordering.",
    [AI_QUICK_PROMPTS[2]]: "In Vijay Nagar Scheme 54, 'The Hive Modern Residency' has private AC single rooms at ₹8,500/mo with 300 Mbps Wi-Fi, chef meals, and biometric security.",
    [AI_QUICK_PROMPTS[3]]: "'Apollo & MedPlus Chemist' opposite DAVV Gate 1 is open 24/7 with WhatsApp ordering (+91 98930 77112). They deliver medicines straight to campus hostels."
  };

  const handleSelectPrompt = (prompt) => {
    setActiveQuery(prompt);
    setIsAnswering(true);
    setTimeout(() => {
      setCurrentResponse(sampleResponses[prompt] || "I scanned Indore databases and found 3 verified matches near your location with direct owner WhatsApp contacts.");
      setIsAnswering(false);
    }, 400);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setActiveQuery(inputVal.trim());
    setIsAnswering(true);
    setTimeout(() => {
      setCurrentResponse(`Analyzing your request for "${inputVal}" in Indore. Found verified local options matching your budget and amenities!`);
      setIsAnswering(false);
      setInputVal('');
    }, 500);
  };

  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F5] relative border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider mb-3 border border-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Local Scout</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#121417] leading-tight mb-3">
            Need a local recommendation?
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-medium">
            Ask any specific question in plain Hindi/English. Our assistant knows Indore’s lanes, mess timings, and landlord vibes.
          </p>
        </div>

        {/* Minimal Elegant Chat Widget */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-5 border-b border-stone-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#121417] text-[#D2FC00] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>NearU Scout AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h4>
                <p className="text-[11px] text-stone-500">Trained on 4,000+ real Indore resident reviews</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-time DB</span>
            </div>
          </div>

          {/* Conversation Bubbles */}
          <div className="space-y-4 mb-6">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] sm:max-w-[75%] bg-[#121417] text-white rounded-2xl rounded-tr-xs px-4 py-3 text-sm font-medium leading-relaxed shadow-sm">
                <p>{activeQuery}</p>
                <span className="block text-[10px] text-stone-400 mt-1 text-right">You · Just now</span>
              </div>
            </div>

            {/* AI Assistant response */}
            <div className="flex justify-start items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-black" />
              </div>

              <div className="max-w-[90%] sm:max-w-[80%] bg-[#F7F5F0] text-stone-900 rounded-2xl rounded-tl-xs px-4 py-3.5 text-sm font-medium leading-relaxed border border-stone-200 shadow-xs">
                {isAnswering ? (
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1">Scanning Indore listings...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-stone-800">{currentResponse}</p>
                    <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Verified Resident Match
                      </span>
                      <button
                        onClick={onExploreListings}
                        className="text-[11px] font-bold text-black hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>View PG Cards</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="pt-2 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Tap to test prompt:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AI_QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPrompt(prompt)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    activeQuery === prompt
                      ? 'bg-stone-900 text-white border-black'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Input */}
          <form onSubmit={handleCustomSubmit} className="relative flex items-center mt-4">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything: e.g. Single room under ₹6k near DAVV with attached washroom..."
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-2xl py-3 pl-4 pr-32 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-2 rounded-xl bg-[#121417] text-white hover:bg-black font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-xs"
            >
              <span>Ask NearU</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D2FC00]" />
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
