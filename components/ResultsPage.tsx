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

  const handleRestart = () => router.push('/');

  const openShareModal = () => {
    setShareMessage(aiShareMessage || `🎃 I'm a ${assignment.assigned_persona}! ${assignment.core_trait_summary} Try the Monster Matchmaker quiz!`);
    setShowShareModal(true);
  };

  const handleShareAsPDF = async () => {
    setIsProcessing(true);
    try {
      window.print();
    } finally {
      setIsProcessing(false);
      setShowShareModal(false);
    }
  };

  const captureAsImage = async (): Promise<Blob | null> => {
    if (!resultsRef.current) return null;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const originalWarn = console.warn;
      console.warn = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && args[0].includes('unsupported color function')) return;
        originalWarn.apply(console, args);
      };
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      console.warn = originalWarn;
      return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0));
    } catch {
      return null;
    }
  };

  const handleShareAsImage = async () => {
    setIsProcessing(true);
    try {
      const imageBlob = await captureAsImage();
      if (imageBlob && navigator.canShare?.({ files: [new File([imageBlob], 'monster-result.png', { type: 'image/png' })] })) {
        await navigator.share({ title: 'My Monster Persona', text: shareMessage, files: [new File([imageBlob], 'monster-result.png', { type: 'image/png' })] });
      } else if (imageBlob) {
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monster-${assignment.assigned_persona.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        await navigator.clipboard.writeText(shareMessage);
        alert('Image downloaded! Message copied to clipboard.');
      }
    } catch { /* ignore */ } finally {
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

  return (
    <>
      {/* Full viewport single-fold results page */}
      <div 
        ref={resultsRef}
        className="min-h-screen w-full flex flex-col justify-center px-4 py-6 print:py-4 print:px-8"
        style={{ maxHeight: '100vh' }}
      >
        <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
          {/* Compact Header */}
          <div className="text-center mb-4 print:mb-2 relative flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-violet/20 rounded-full blur-3xl -z-10" />
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-neon-violet" />
              <span className="text-neon-violet text-xl">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon-violet" />
            </div>
            <p className="text-xl md:text-2xl font-gothic text-gray-400 mb-1">You Are A</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-gothic font-black text-neon-violet text-glow-lg leading-none" data-testid="monster-name">
              {assignment.assigned_persona}
            </h1>
          </div>

          {/* Main Content - Responsive Grid */}
          <div className={`flex-1 grid ${hasImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'} gap-4 md:gap-6 mb-4 print:mb-2 min-h-0`}>
            {/* Image Section - Clean, no wrapper glow */}
            {hasImage && (
              <div className="flex items-center justify-center">
                <div className="w-full max-w-xs md:max-w-sm aspect-square relative overflow-hidden rounded-lg border-2 border-neon-violet">
                  {transformedImage ? (
                    <img src={transformedImage} alt="Your monster transformation" className="w-full h-full object-cover" data-testid="transformed-image" />
                  ) : userImage ? (
                    <img src={userImage} alt="Your uploaded photo" className="w-full h-full object-cover" data-testid="user-image" />
                  ) : null}
                </div>
              </div>
            )}

            {/* Traits and Rationale - Clean, no glow */}
            <div className="flex flex-col gap-3 md:gap-4 justify-center">
              <div className="bg-[#1a1a1a] border border-neon-violet rounded-lg p-4 print:p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl text-neon-violet">✦</span>
                  <h3 className="text-lg md:text-xl font-gothic font-bold text-neon-violet">Core Traits</h3>
                </div>
                <p className="text-lg md:text-xl lg:text-2xl font-gothic font-semibold text-gray-200 leading-snug" data-testid="trait-summary">
                  {assignment.core_trait_summary}
                </p>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 print:p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl text-neon-violet">✦</span>
                  <h3 className="text-lg md:text-xl font-gothic font-bold text-neon-violet">Why?</h3>
                </div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }} data-testid="rationale">
                  {assignment.rationale}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex flex-row gap-3 justify-center items-center flex-shrink-0 no-print">
            <button
              onClick={handleRestart}
              className="px-6 py-3 font-gothic font-bold rounded-lg text-sm md:text-base bg-neon-violet hover:neon-glow-lg text-white transition-all-smooth"
              data-testid="restart-button"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart
              </span>
            </button>
            <button
              onClick={openShareModal}
              className="px-6 py-3 font-gothic font-bold rounded-lg text-sm md:text-base border-2 border-neon-violet text-neon-violet hover:bg-neon-violet hover:text-white transition-all-smooth"
              data-testid="share-button"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </span>
            </button>
          </div>
        </div>
      </div>


      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-[#1a1a1a] border-2 border-neon-violet rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-gothic font-bold text-neon-violet">Share Your Results</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Customize your message:</label>
              <textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="w-full h-24 px-3 py-2 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white text-sm focus:border-neon-violet resize-none"
              />
              <button onClick={handleCopyMessage} className="mt-1 text-xs text-neon-violet hover:underline">
                Copy message
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleShareAsPDF}
                disabled={isProcessing}
                className="w-full px-4 py-3 font-gothic font-bold rounded-lg bg-neon-violet text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                Save as PDF
              </button>

              <button
                onClick={handleShareAsImage}
                disabled={isProcessing}
                className="w-full px-4 py-3 font-gothic font-bold rounded-lg border-2 border-neon-violet text-neon-violet hover:bg-neon-violet hover:text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                Share as Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
