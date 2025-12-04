'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AssignmentResult } from '../types';

interface ResultsPageProps {
  assignment: AssignmentResult;
  imagePrompt: string;
  userImage: string | null;
  transformedImage?: string;
}

export default function ResultsPage({ assignment, imagePrompt, userImage, transformedImage }: ResultsPageProps) {
  const router = useRouter();

  const handleRestart = () => {
    router.push('/');
  };

  const handleShare = () => {
    const shareText = `I'm a ${assignment.assigned_persona}! ${assignment.core_trait_summary}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Monster Persona',
        text: shareText,
        url: window.location.href
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header with dramatic reveal */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-violet/30 rounded-full blur-3xl -z-10 pulse-glow" />
          
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-violet" />
              <span className="text-neon-violet text-3xl">✦</span>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-violet" />
            </div>
            <h1 className="text-4xl md:text-5xl font-gothic font-bold mb-2 text-gray-300">
              You Are A
            </h1>
          </div>
          
          <h2 
            className="text-6xl md:text-8xl font-gothic font-black mb-8 text-neon-violet text-glow-lg leading-tight"
            data-testid="monster-name"
          >
            {assignment.assigned_persona}
          </h2>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-violet" />
            <span className="text-neon-violet text-3xl">✦</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-violet" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={`grid ${(userImage || transformedImage) ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'} gap-8 mb-12`}>
          {/* Image Section - Show original or transformed image */}
          {(userImage || transformedImage) && (
            <div className="gothic-card neon-border-thick hover-lift transition-glow">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-dark-bg neon-border">
                {transformedImage ? (
                  <img
                    src={transformedImage}
                    alt="Your monster transformation"
                    className="w-full h-full object-cover"
                    data-testid="transformed-image"
                  />
                ) : userImage ? (
                  <img
                    src={userImage}
                    alt="Your uploaded photo"
                    className="w-full h-full object-cover"
                    data-testid="user-image"
                  />
                ) : null}
              </div>
            </div>
          )}

          {/* Traits and Rationale Section */}
          <div className="space-y-6">
            {/* Core Traits */}
            <div className="gothic-card neon-border-thick hover-lift transition-glow group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✦</span>
                <h3 className="text-2xl font-gothic font-bold text-neon-violet group-hover:text-glow transition-all-smooth">
                  Core Traits
                </h3>
              </div>
              <p 
                className="text-2xl md:text-3xl font-gothic font-semibold text-gray-200 leading-relaxed"
                data-testid="trait-summary"
              >
                {assignment.core_trait_summary}
              </p>
            </div>

            {/* Rationale */}
            <div className="gothic-card neon-border hover-lift transition-glow group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✦</span>
                <h3 className="text-2xl font-gothic font-bold text-neon-violet group-hover:text-glow transition-all-smooth">
                  Why You Match
                </h3>
              </div>
              <p 
                className="text-lg text-gray-300 leading-relaxed font-light"
                data-testid="rationale"
              >
                {assignment.rationale}
              </p>
            </div>
          </div>
        </div>



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handleRestart}
            className="px-12 py-5 font-gothic font-bold rounded-lg text-xl bg-neon-violet hover:neon-glow-lg text-white transition-all-smooth transform hover:scale-105 hover:-translate-y-1 shadow-lg"
            data-testid="restart-button"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restart Quiz
            </span>
          </button>
          <button
            onClick={handleShare}
            className="px-12 py-5 font-gothic font-bold rounded-lg text-xl border-2 border-neon-violet text-neon-violet hover:bg-neon-violet hover:text-white hover:neon-glow transition-all-smooth transform hover:scale-105 hover:-translate-y-1"
            data-testid="share-button"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Results
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
