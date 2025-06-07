import { Loader2, Check  } from "lucide-react";
import React from "react";

interface StepProgressProps {
  currentStep: number; // 0 = Awaiting deposit, 1 = Confirming, ...
}

const steps = [
  "Awaiting deposit",
  "Confirming",
  "Exchanging",
  "Sending to you",
];

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {

    return (
        <div className="flex flex-row md:flex-col justify-center md:items-center space-x-3 md:space-y-4  w-full max-w-xl mx-auto">
          {/* Step icons and connecting lines */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-1/4 md:w-full px-2">
            {steps.map((_, index) => {
              const isLast = index === steps.length - 1;
              const isCompleted = currentStep > index;
              const isActive = currentStep === index;
    
              return (
                <div key={index} className="flex flex-col md:flex-row justify-center items-center w-full relative">
                  {/* Step icon */}
                    <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10
                        ${isCompleted ? "bg-green-400 border-green-400" :
                            isActive ? "bg-[#1a1a1a] border-green-400" :
                            "bg-[#1a1a1a] border-gray-600"}`}
                    >
                        {isCompleted ? (
                        <Check className="w-3 h-3 text-black" />
                        ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                        <div className="w-2 h-2 bg-gray-600 rounded-full" />
                        )}
                    </div>
    
                    {/* Line to next step */}
                    {!isLast && (
                        <div
                        className={`hidden md:block absolute top-1/2  transform -translate-y-1/2 translate-x-1/2 w-full h-0.5 ${
                            isCompleted ? "bg-green-400" : "bg-gray-600"
                        }`}
                        style={{ width: "100%" }}
                        />
                    )}

                    {!isLast && (
                        <div className="block md:hidden w-px h-4 border-l-2 border-solid border-gray-600 m-1" />
                    )}

                </div>
              );
            })}
          </div>
    
          {/* Step Labels aligned under each icon */}
          <div className="flex flex-col md:flex-row justify-between items-start w-2/4 md:w-full px-2">
            {steps.map((label, index) => (
              <div key={index} className="w-full md:w-1/4 text-center text-xs">
                <span
                  className={`${
                    currentStep === index ? "text-green-400 font-medium" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
};
