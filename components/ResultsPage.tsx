'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssignmentResult } from '../types';

interface ResultsPageProps {
  assignment: AssignmentResult;
  imagePrompt: string;
  userImage: string | null;
  transformedImage?: string;
  aiShareMessage?: string;
}

export default function ResultsPage({ assignment, userImage, transformedImage, aiShareMessage }: ResultsPageProps) {
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRestart = () => {
    // Clear session storage
    sessionStorage.removeItem('monsterAssignment');
    sessionStorage.removeItem('userImage');
    router.push('/');
  };

  const openShareModal = () => {
    setShareMessage(aiShareMessage || `🎃 I'm a ${assignment.assigned_persona}! ${assignment.core_trait_summary} Try the Monster Matchmaker quiz!`);
    setShowShareModal(true);
  };

  const handleShareToWhatsApp = async () => {
    setIsProcessing(true);
    try {
      if (transformedImage) {
        const response = await fetch(transformedImage);
        const blob = await response.blob();
        const file = new File([blob], 'monster-transformation.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ text: shareMessage, files: [file] });
          setShowShareModal(false);
          return;
        }
      }
      const encodedMessage = encodeURIComponent(shareMessage);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
      if (transformedImage) {
        const a = document.createElement('a');
        a.href = transformedImage;
        a.download = `${assignment.assigned_persona.toLowerCase().replace(/\s+/g, '-')}-transformation.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert('Image downloaded! Attach it to your WhatsApp message.');
      }
    } catch {
      const encodedMessage = encodeURIComponent(shareMessage);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    } finally {
      setIsProcessing(false);
      setShowShareModal(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert('Message copied!');
    } catch { /* ignore */ }
  };

  const hasImage = userImage || transformedImage;

  const handleDownloadTransformation = () => {
    if (!transformedImage) return;
    const a = document.createElement('a');
    a.href = transformedImage;
    a.download = `${assignment.assigned_persona.toLowerCase().replace(/\s+/g, '-')}-transformation.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div ref={resultsRef} className="min-h-screen w-full flex flex-col justify-center px-3 sm:px-4 py-4 sm:py-6">
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          {/* Header - Compact on mobile */}
          <div className="text-center mb-3 sm:mb-4 relative flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-neon-violet/20 rounded-full blur-3xl -z-10" />
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-neon-violet" />
              <span className="text-neon-violet text-base sm:text-lg">✦</span>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-neon-violet" />
            </div>
            <p className="text-sm sm:text-lg md:text-xl font-gothic text-gray-400 mb-0.5">You Are A</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-gothic font-black text-neon-violet text-glow-lg leading-none" data-testid="monster-name">
              {assignment.assigned_persona}
            </h1>
          </div>


          {/* Main Content Grid */}
          <div className={`flex-1 grid ${hasImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'} gap-3 sm:gap-4 mb-3 sm:mb-4 min-h-0`}>
            {/* Image Section */}
            {hasImage && (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-full max-w-[200px] sm:max-w-[280px] md:max-w-xs aspect-square relative overflow-hidden rounded-lg border-2 border-neon-violet">
                  {transformedImage ? (
                    <img src={transformedImage} alt="Your monster transformation" className="w-full h-full object-cover" data-testid="transformed-image" />
                  ) : userImage ? (
                    <img src={userImage} alt="Your uploaded photo" className="w-full h-full object-cover" data-testid="user-image" />
                  ) : null}
                </div>
                {transformedImage && (
                  <button
                    onClick={handleDownloadTransformation}
                    className="px-3 py-1.5 text-xs sm:text-sm font-gothic font-bold rounded-lg border border-neon-violet text-neon-violet hover:bg-neon-violet hover:text-white transition-all-smooth no-print"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Traits and Rationale */}
            <div className="flex flex-col gap-2 sm:gap-3 justify-center">
              <div className="bg-[#1a1a1a] border border-neon-violet rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base sm:text-lg text-neon-violet">✦</span>
                  <h3 className="text-sm sm:text-base md:text-lg font-gothic font-bold text-neon-violet">Core Traits</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-gothic font-semibold text-gray-200 leading-snug" data-testid="trait-summary">
                  {assignment.core_trait_summary}
                </p>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base sm:text-lg text-neon-violet">✦</span>
                  <h3 className="text-sm sm:text-base md:text-lg font-gothic font-bold text-neon-violet">Why?</h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed" style={{ fontFamily: "'Inter', system-ui, sans-serif" }} data-testid="rationale">
                  {assignment.rationale}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-2 sm:gap-3 justify-center items-center flex-shrink-0 no-print">
            <button
              onClick={handleRestart}
              className="px-4 sm:px-5 py-2 sm:py-2.5 font-gothic font-bold rounded-lg text-xs sm:text-sm bg-neon-violet hover:neon-glow-lg text-white transition-all-smooth"
              data-testid="restart-button"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart
              </span>
            </button>
            <button
              onClick={openShareModal}
              className="px-4 sm:px-5 py-2 sm:py-2.5 font-gothic font-bold rounded-lg text-xs sm:text-sm border-2 border-neon-violet text-neon-violet hover:bg-neon-violet hover:text-white transition-all-smooth"
              data-testid="share-button"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </span>
            </button>
          </div>
        </div>
      </div>


      {/* Share Modal - Mobile optimized */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 no-print">
          <div className="bg-[#1a1a1a] border-2 border-neon-violet rounded-xl sm:rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-gothic font-bold text-neon-violet">Share Results</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-xs sm:text-sm text-gray-300 mb-1.5">Customize message:</label>
              <textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="w-full h-20 sm:h-24 px-2.5 py-2 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white text-xs sm:text-sm focus:border-neon-violet resize-none"
              />
              <button onClick={handleCopyMessage} className="mt-1 text-xs text-neon-violet hover:underline">
                Copy message
              </button>
            </div>

            <button
              onClick={handleShareToWhatsApp}
              disabled={isProcessing}
              className="w-full px-3 py-3 sm:py-3.5 font-gothic font-bold rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all-smooth text-sm sm:text-base"
            >
              {isProcessing ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              )}
              Share to WhatsApp
            </button>
            
            <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-center">
              {transformedImage ? 'Image will be shared with message' : 'Share your monster persona!'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
