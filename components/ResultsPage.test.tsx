import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultsPage from './ResultsPage';
import { AssignmentResult } from '../types';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ResultsPage', () => {
  const mockAssignment: AssignmentResult = {
    assigned_persona: 'Vampire',
    rationale: 'Your nocturnal nature and desire for power align perfectly with the aristocratic vampire archetype.',
    core_trait_summary: 'aristocratic, immortal, nocturnal, sophisticated, ancient',
  };

  const mockImagePrompt = 'Transform the source image into a Vampire with neon-gothic horror aesthetic, electric violet lighting #8E48FF, foggy city street background, photorealistic, 8k, cinematic volumetric lighting';

  const mockUserImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  beforeEach(() => {
    mockPush.mockClear();
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  describe('Rendering all result fields', () => {
    it('should display the assigned monster name', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      const monsterName = screen.getByTestId('monster-name');
      expect(monsterName).toBeInTheDocument();
      expect(monsterName).toHaveTextContent('Vampire');
    });

    it('should display the core trait summary', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      const traitSummary = screen.getByTestId('trait-summary');
      expect(traitSummary).toBeInTheDocument();
      expect(traitSummary).toHaveTextContent('aristocratic, immortal, nocturnal, sophisticated, ancient');
    });

    it('should display the rationale text', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      const rationale = screen.getByTestId('rationale');
      expect(rationale).toBeInTheDocument();
      expect(rationale).toHaveTextContent('Your nocturnal nature and desire for power');
    });

    it('should display the user uploaded image when provided', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      const userImageElement = screen.getByTestId('user-image');
      expect(userImageElement).toBeInTheDocument();
      expect(userImageElement).toHaveAttribute('src', mockUserImage);
    });

    it('should display restart and share buttons', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      expect(screen.getByTestId('restart-button')).toBeInTheDocument();
      expect(screen.getByTestId('share-button')).toBeInTheDocument();
    });
  });

  describe('Restart button navigation', () => {
    it('should navigate back to quiz when restart button is clicked', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      const restartButton = screen.getByTestId('restart-button');
      fireEvent.click(restartButton);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Handling missing image', () => {
    it('should not display image section when no user image is provided', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={null}
        />
      );

      // Image section should not be rendered at all
      expect(screen.queryByTestId('user-image')).not.toBeInTheDocument();
      // Layout should be single column
      const gridContainer = screen.getByText('Core Traits').closest('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-1');
    });

    it('should still render all other fields when image is missing', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={null}
        />
      );

      expect(screen.getByTestId('monster-name')).toHaveTextContent('Vampire');
      expect(screen.getByTestId('trait-summary')).toBeInTheDocument();
      expect(screen.getByTestId('rationale')).toBeInTheDocument();
      expect(screen.getByTestId('restart-button')).toBeInTheDocument();
    });
  });

  describe('Share functionality', () => {
    it('should call clipboard API when share button is clicked and navigator.share is not available', () => {
      render(
        <ResultsPage
          assignment={mockAssignment}
          imagePrompt={mockImagePrompt}
          userImage={mockUserImage}
        />
      );

      const shareButton = screen.getByTestId('share-button');
      fireEvent.click(shareButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
