'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ResultsPage from '../../components/ResultsPage';
import { MatchmakerResponse } from '../../types';

function ResultsContent() {
  // Get data from sessionStorage
  const assignmentData = typeof window !== 'undefined' 
    ? sessionStorage.getItem('monsterAssignment') 
    : null;
  
  const userImage = typeof window !== 'undefined' 
    ? sessionStorage.getItem('userImage') 
    : null;

  if (!assignmentData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="gothic-card neon-border p-12">
            <svg className="w-24 h-24 mx-auto mb-6 text-neon-violet/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-5xl font-gothic font-bold mb-4 text-glow">No Results Found</h1>
            <p className="text-gray-400 mb-8 text-lg">Please complete the quiz first to discover your monster persona.</p>
            <a 
              href="/"
              className="px-12 py-5 font-gothic font-bold rounded-lg text-xl bg-neon-violet hover:neon-glow-lg text-white transition-all-smooth inline-block transform hover:scale-105"
            >
              Take the Quiz
            </a>
          </div>
        </div>
      </div>
    );
  }

  try {
    const parsedData: MatchmakerResponse = JSON.parse(assignmentData);
    
    return (
      <ResultsPage
        assignment={parsedData.assignment_result}
        imagePrompt={parsedData.image_generation_prompt}
        userImage={userImage}
        transformedImage={(parsedData as any).transformed_image}
        aiShareMessage={(parsedData as any).share_message}
      />
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="gothic-card border-2 border-red-500 p-12">
            <svg className="w-24 h-24 mx-auto mb-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-5xl font-gothic font-bold mb-4 text-red-400">Error Loading Results</h1>
            <p className="text-gray-400 mb-8 text-lg">There was a problem loading your results. Please try again.</p>
            <a 
              href="/"
              className="px-12 py-5 font-gothic font-bold rounded-lg text-xl bg-neon-violet hover:neon-glow-lg text-white transition-all-smooth inline-block transform hover:scale-105"
            >
              Try Again
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="gothic-card neon-border p-12">
            <div className="flex flex-col items-center gap-6">
              <svg className="animate-spin h-16 w-16 text-neon-violet" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div className="text-4xl font-gothic font-bold text-glow">Loading Your Results...</div>
              <p className="text-gray-400">Preparing your monster persona</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
