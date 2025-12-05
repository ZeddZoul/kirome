'use client';

import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/navigation';

interface QuizFormData {
  timeOfDay: string;
  weather: string;
  conflictStyle: string;
  snackFlavor: string;
  ambition: string;
}

interface Question {
  id: keyof QuizFormData;
  label: string;
  number: string;
  isDoubleWeighted: boolean;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'timeOfDay',
    label: 'What time of day do you feel most alive?',
    number: 'I',
    isDoubleWeighted: false,
    options: [
      { value: 'dawn', label: 'Dawn - Fresh starts and new beginnings' },
      { value: 'morning', label: 'Morning - Productive and energetic' },
      { value: 'afternoon', label: 'Afternoon - Steady and reliable' },
      { value: 'dusk', label: 'Dusk - Mysterious and transitional' },
      { value: 'night', label: 'Night - Dark and contemplative' },
      { value: 'midnight', label: 'Midnight - Witching hour enthusiast' },
    ]
  },
  {
    id: 'weather',
    label: 'What weather matches your mood?',
    number: 'II',
    isDoubleWeighted: false,
    options: [
      { value: 'sunny', label: 'Sunny - Bright and optimistic' },
      { value: 'cloudy', label: 'Cloudy - Contemplative and moody' },
      { value: 'rainy', label: 'Rainy - Melancholic and introspective' },
      { value: 'stormy', label: 'Stormy - Intense and dramatic' },
      { value: 'foggy', label: 'Foggy - Mysterious and obscure' },
      { value: 'snowy', label: 'Snowy - Quiet and serene' },
    ]
  },
  {
    id: 'conflictStyle',
    label: 'How do you handle conflict?',
    number: 'III',
    isDoubleWeighted: true,
    options: [
      { value: 'confrontation', label: 'Direct confrontation' },
      { value: 'avoidance', label: 'Avoidance and retreat' },
      { value: 'manipulation', label: 'Strategic manipulation' },
      { value: 'diplomacy', label: 'Diplomatic negotiation' },
      { value: 'chaos', label: 'Embrace the chaos' },
      { value: 'silence', label: 'Silent intimidation' },
    ]
  },
  {
    id: 'snackFlavor',
    label: 'What\'s your ideal snack flavor?',
    number: 'IV',
    isDoubleWeighted: false,
    options: [
      { value: 'sweet', label: 'Sweet - Sugar and comfort' },
      { value: 'salty', label: 'Salty - Savory and satisfying' },
      { value: 'sour', label: 'Sour - Tangy and sharp' },
      { value: 'bitter', label: 'Bitter - Dark and complex' },
      { value: 'umami', label: 'Umami - Rich and mysterious' },
      { value: 'spicy', label: 'Spicy - Hot and intense' },
    ]
  },
  {
    id: 'ambition',
    label: 'What drives your ambition?',
    number: 'V',
    isDoubleWeighted: true,
    options: [
      { value: 'power', label: 'Power and control' },
      { value: 'knowledge', label: 'Knowledge and wisdom' },
      { value: 'connection', label: 'Connection and belonging' },
      { value: 'freedom', label: 'Freedom and independence' },
      { value: 'legacy', label: 'Legacy and immortality' },
      { value: 'chaos', label: 'Chaos and disruption' },
    ]
  }
];

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0-4 for questions, 5 for image upload
  const [formData, setFormData] = useState<QuizFormData>({
    timeOfDay: '',
    weather: '',
    conflictStyle: '',
    snackFlavor: '',
    ambition: ''
  });
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justArrivedAtImageStep, setJustArrivedAtImageStep] = useState(false);

  const currentQuestion = currentStep < 5 ? QUESTIONS[currentStep] : null;
  const isImageUploadStep = currentStep === 5;
  const totalSteps = 6; // 5 questions + 1 image upload

  const handleSelectChange = (value: string) => {
    if (value === 'other') {
      setShowOtherInput(true);
      setOtherValue('');
    } else {
      setShowOtherInput(false);
      setOtherValue('');
      if (currentQuestion) {
        setFormData(prev => ({
          ...prev,
          [currentQuestion.id]: value
        }));
      }
    }
  };

  const handleOtherInputChange = (value: string) => {
    setOtherValue(value);
    if (currentQuestion) {
      setFormData(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));
    }
  };

  const isCurrentStepComplete = (): boolean => {
    if (isImageUploadStep) {
      return true; // Image upload is optional
    }
    if (currentQuestion) {
      const answer = formData[currentQuestion.id];
      return answer !== '' && answer.trim() !== '';
    }
    return false;
  };

  const handleNext = () => {
    if (isCurrentStepComplete() && currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setShowOtherInput(false);
      setOtherValue('');
      setError(null);
      
      // If moving to image upload step, set flag to prevent immediate submission
      if (nextStep === 5) {
        setJustArrivedAtImageStep(true);
        setTimeout(() => setJustArrivedAtImageStep(false), 100);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowOtherInput(false);
      setOtherValue('');
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if just arrived at image step
    if (justArrivedAtImageStep) {
      return;
    }
    
    // Check if all questions are answered
    const allQuestionsAnswered = Object.values(formData).every(value => value !== '' && value.trim() !== '');
    if (!allQuestionsAnswered) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare request body
      const requestBody: any = {
        timeOfDay: formData.timeOfDay,
        weather: formData.weather,
        conflictStyle: formData.conflictStyle,
        snackFlavor: formData.snackFlavor,
        ambition: formData.ambition
      };

      // Add image data if available
      if (uploadedImage) {
        const reader = new FileReader();
        const imageDataPromise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(uploadedImage);
        });
        requestBody.imageData = await imageDataPromise;
      }

      // Call API route
      const response = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get monster assignment');
      }

      const result = await response.json();

      // Store all data in sessionStorage
      sessionStorage.setItem('monsterAssignment', JSON.stringify(result));
      
      // Store original image if uploaded
      if (uploadedImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem('userImage', reader.result as string);
          router.push('/results');
        };
        reader.readAsDataURL(uploadedImage);
      } else {
        router.push('/results');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  // Haunting loading messages
  const loadingMessages = [
    "Summoning ancient spirits...",
    "Reading your dark aura...",
    "Consulting the shadows...",
    "The void whispers your name...",
    "Awakening dormant creatures...",
    "Decoding your inner monster...",
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Cycle through loading messages
  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);

  return (
    <>
      {/* Haunting Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Animated fog/mist background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-violet/10 via-transparent to-neon-violet/5 animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-violet/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* Central content */}
          <div className="relative z-10 text-center px-8">
            {/* Glowing eye animation */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto relative">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-neon-violet rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                {/* Inner pulsing eye */}
                <div className="absolute inset-4 bg-gradient-to-br from-neon-violet to-purple-900 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-black rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-neon-violet/30 rounded-full blur-xl animate-pulse" />
              </div>
            </div>
            
            {/* Haunting text */}
            <h2 className="text-3xl md:text-4xl font-gothic font-black text-neon-violet text-glow-lg mb-4 animate-pulse">
              The Ritual Begins...
            </h2>
            
            {/* Cycling messages */}
            <p className="text-xl text-gray-300 font-gothic mb-6 h-8 transition-opacity duration-500">
              {loadingMessages[loadingMessageIndex]}
            </p>
            
            {/* Creepy progress dots */}
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-neon-violet rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
                />
              ))}
            </div>
            
            {/* Warning text */}
            <p className="text-sm text-gray-500 mt-8 font-light italic">
              Do not look away... the transformation is near
            </p>
          </div>
        </div>
      )}

      {/* Quiz container with background image */}
      <div 
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay with deep purple tint */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[rgba(30,10,50,0.7)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[rgba(50,20,80,0.3)] to-black/90" />
        
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
          <div className="max-w-3xl mx-auto w-full">
            {/* Logo */}
            <div className="flex flex-col items-center mb-3 sm:mb-6">
              <img 
                src="/logo.png" 
                alt="Kiroween Kinship" 
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-1 sm:mb-2 opacity-90"
              />
              <span className="text-xs sm:text-sm md:text-base font-gothic text-neon-violet/80 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                Kiroween Kinship
              </span>
            </div>

            {/* Decorative header with gothic styling */}
            <div className="text-center mb-4 sm:mb-10 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-neon-violet/20 rounded-full blur-3xl -z-10" />
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-gothic font-black mb-2 sm:mb-4 text-glow-lg text-center text-white">
                Discover Your Monster
              </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-neon-violet" />
            <span className="text-neon-violet text-lg sm:text-2xl">✦</span>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-neon-violet" />
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all-smooth ${
                  index === currentStep
                    ? 'w-8 sm:w-12 bg-neon-violet neon-glow'
                    : index < currentStep
                    ? 'w-5 sm:w-8 bg-neon-violet/60'
                    : 'w-5 sm:w-8 bg-gray-700'
                }`}
              />
            ))}
          </div>
          
          <p className="text-sm sm:text-lg text-gray-400 font-light" data-testid="progress-text">
            {isImageUploadStep 
              ? 'Optional: Upload Your Photo' 
              : `Question ${currentStep + 1} of 5`}
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4 sm:space-y-8"
        >
          {/* Current Question or Image Upload */}
          {!isImageUploadStep && currentQuestion && (
            <div className={`gothic-card-compact sm:gothic-card ${currentQuestion.isDoubleWeighted ? 'neon-border-thick' : 'neon-border'} hover-lift transition-glow group relative overflow-visible`}>
              <label className="block text-lg sm:text-2xl md:text-3xl font-gothic font-semibold mb-3 sm:mb-6 text-neon-violet group-hover:text-glow transition-all-smooth">
                <span className="text-xl sm:text-3xl mr-2 sm:mr-3">{currentQuestion.number}.</span> {currentQuestion.label}
              </label>
              
              <select
                value={showOtherInput ? 'other' : formData[currentQuestion.id]}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="w-full p-3 sm:p-5 rounded-lg bg-dark-bg border border-dark-border text-white text-base sm:text-lg focus:border-neon-violet focus:neon-glow focus:outline-none transition-all-smooth hover:border-neon-violet/50 mb-2 sm:mb-4"
                data-testid={`${currentQuestion.id}-input`}
              >
                <option value="">Select an option...</option>
                {currentQuestion.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="other">Other (specify your own)</option>
              </select>

              {showOtherInput && (
                <div className="mt-2 sm:mt-4 animate-fadeIn">
                  <label className="block text-xs sm:text-sm font-gothic font-semibold mb-1 sm:mb-2 text-gray-300">
                    Please specify:
                  </label>
                  <input
                    type="text"
                    value={otherValue}
                    onChange={(e) => handleOtherInputChange(e.target.value)}
                    placeholder="Enter your custom answer..."
                    className="w-full p-3 sm:p-4 rounded-lg bg-dark-bg border border-dark-border text-white focus:border-neon-violet focus:neon-glow focus:outline-none transition-all-smooth"
                    data-testid="other-input"
                    autoFocus
                  />
                </div>
              )}
            </div>
          )}

          {/* Image Upload Step */}
          {isImageUploadStep && (
            <div className="gothic-card-compact sm:gothic-card neon-border hover-lift transition-glow">
              <label className="block text-lg sm:text-2xl md:text-3xl font-gothic font-semibold mb-1 sm:mb-4 text-neon-violet">
                <span className="text-lg sm:text-3xl mr-1 sm:mr-3">✦</span> Upload Your Photo
              </label>
              <p className="text-xs sm:text-base text-gray-400 mb-2 sm:mb-6 font-light">
                <span className="text-neon-violet font-medium">Optional</span> — see yourself as your monster
              </p>
              <ImageUpload 
                onImageSelect={setUploadedImage}
                currentImage={uploadedImage}
                isOptional={true}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="gothic-card border-2 border-red-500 bg-red-900/30 backdrop-blur" data-testid="error-message">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center pt-6 sm:pt-8 gap-3 sm:gap-4">
            {/* Back Button */}
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 font-gothic font-bold rounded-lg text-sm sm:text-lg border-2 border-gray-600 text-gray-300 hover:border-neon-violet hover:text-neon-violet transition-all-smooth transform hover:scale-105"
                data-testid="back-button"
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </span>
              </button>
            )}

            {/* Spacer for alignment when no back button */}
            {currentStep === 0 && <div className="hidden sm:block" />}

            {/* Next or Submit Button */}
            {!isImageUploadStep ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepComplete()}
                className={`
                  w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 font-gothic font-bold rounded-lg text-base sm:text-lg transition-all-smooth relative overflow-hidden
                  ${isCurrentStepComplete()
                    ? 'bg-neon-violet hover:neon-glow-lg text-white transform hover:scale-105 cursor-pointer shadow-lg'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
                data-testid="next-button"
              >
                <span className="flex items-center justify-center gap-2">
                  Next
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 font-gothic font-bold rounded-lg text-base sm:text-lg transition-all-smooth relative overflow-hidden
                  ${!isLoading
                    ? 'bg-neon-violet hover:neon-glow-lg text-white transform hover:scale-105 cursor-pointer shadow-lg'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                  }
                `}
                data-testid="submit-button"
              >
                {isLoading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
                <span className="relative flex items-center gap-2 sm:gap-3 justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm sm:text-base">Discovering...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">Reveal My Monster</span>
                      <span className="text-lg sm:text-2xl">✦</span>
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </form>
          </div>
        </div>
      </div>
    </>
  );
}
