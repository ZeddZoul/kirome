/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizPage from './QuizPage';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock ImageUpload component
jest.mock('./ImageUpload', () => {
  return function MockImageUpload({ onImageSelect }: any) {
    return (
      <div data-testid="mock-image-upload">
        <button
          data-testid="mock-image-select"
          onClick={() => {
            const mockFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
            onImageSelect(mockFile);
          }}
        >
          Select Image
        </button>
      </div>
    );
  };
});

describe('QuizPage Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Submit button state', () => {
    it('should disable submit button when form is incomplete', () => {
      render(<QuizPage />);
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('cursor-not-allowed');
    });

    it('should keep submit button disabled when only some fields are filled', () => {
      render(<QuizPage />);
      
      const timeOfDayInput = screen.getByTestId('timeOfDay-input');
      const weatherInput = screen.getByTestId('weather-input');
      
      fireEvent.change(timeOfDayInput, { target: { value: 'night' } });
      fireEvent.change(weatherInput, { target: { value: 'stormy' } });
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all fields are filled', () => {
      render(<QuizPage />);
      
      // Fill all required fields
      fireEvent.change(screen.getByTestId('timeOfDay-input'), { target: { value: 'night' } });
      fireEvent.change(screen.getByTestId('weather-input'), { target: { value: 'stormy' } });
      fireEvent.change(screen.getByTestId('conflictStyle-input'), { target: { value: 'confrontation' } });
      fireEvent.change(screen.getByTestId('snackFlavor-input'), { target: { value: 'sweet' } });
      fireEvent.change(screen.getByTestId('ambition-input'), { target: { value: 'power' } });
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).not.toHaveClass('cursor-not-allowed');
    });
  });

  describe('Form submission', () => {
    it('should call API with correct data when form is submitted', async () => {
      const mockResponse = {
        assignment_result: {
          assigned_persona: 'Vampire',
          rationale: 'You are a creature of the night',
          core_trait_summary: 'aristocratic, immortal, nocturnal, sophisticated, ancient'
        },
        image_generation_prompt: 'Transform into vampire...'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<QuizPage />);
      
      // Fill all required fields
      fireEvent.change(screen.getByTestId('timeOfDay-input'), { target: { value: 'night' } });
      fireEvent.change(screen.getByTestId('weather-input'), { target: { value: 'stormy' } });
      fireEvent.change(screen.getByTestId('conflictStyle-input'), { target: { value: 'confrontation' } });
      fireEvent.change(screen.getByTestId('snackFlavor-input'), { target: { value: 'sweet' } });
      fireEvent.change(screen.getByTestId('ambition-input'), { target: { value: 'power' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/matchmaker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            timeOfDay: 'night',
            weather: 'stormy',
            conflictStyle: 'confrontation',
            snackFlavor: 'sweet',
            ambition: 'power'
          })
        });
      });
    });

    it('should navigate to results page after successful submission', async () => {
      const mockResponse = {
        assignment_result: {
          assigned_persona: 'Vampire',
          rationale: 'You are a creature of the night',
          core_trait_summary: 'aristocratic, immortal, nocturnal, sophisticated, ancient'
        },
        image_generation_prompt: 'Transform into vampire...'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<QuizPage />);
      
      // Fill all required fields
      fireEvent.change(screen.getByTestId('timeOfDay-input'), { target: { value: 'night' } });
      fireEvent.change(screen.getByTestId('weather-input'), { target: { value: 'stormy' } });
      fireEvent.change(screen.getByTestId('conflictStyle-input'), { target: { value: 'confrontation' } });
      fireEvent.change(screen.getByTestId('snackFlavor-input'), { target: { value: 'sweet' } });
      fireEvent.change(screen.getByTestId('ambition-input'), { target: { value: 'power' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
        const callArg = mockPush.mock.calls[0][0];
        expect(callArg).toContain('/results?');
        expect(callArg).toContain('assignment=');
      });
    });

    it('should display error message when API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Monster assignment failed' }),
      });

      render(<QuizPage />);
      
      // Fill all required fields
      fireEvent.change(screen.getByTestId('timeOfDay-input'), { target: { value: 'night' } });
      fireEvent.change(screen.getByTestId('weather-input'), { target: { value: 'stormy' } });
      fireEvent.change(screen.getByTestId('conflictStyle-input'), { target: { value: 'confrontation' } });
      fireEvent.change(screen.getByTestId('snackFlavor-input'), { target: { value: 'sweet' } });
      fireEvent.change(screen.getByTestId('ambition-input'), { target: { value: 'power' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('Monster assignment failed');
      });
    });
  });

  describe('Loading state', () => {
    it('should display loading state during API call', async () => {
      // Create a promise that we can control
      let resolvePromise: any;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

      render(<QuizPage />);
      
      // Fill all required fields
      fireEvent.change(screen.getByTestId('timeOfDay-input'), { target: { value: 'night' } });
      fireEvent.change(screen.getByTestId('weather-input'), { target: { value: 'stormy' } });
      fireEvent.change(screen.getByTestId('conflictStyle-input'), { target: { value: 'confrontation' } });
      fireEvent.change(screen.getByTestId('snackFlavor-input'), { target: { value: 'sweet' } });
      fireEvent.change(screen.getByTestId('ambition-input'), { target: { value: 'power' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      // Check loading state
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Discovering Your Monster...');
        expect(submitButton).toBeDisabled();
      });

      // Resolve the promise to clean up
      resolvePromise({
        ok: true,
        json: async () => ({
          assignment_result: {
            assigned_persona: 'Vampire',
            rationale: 'Test',
            core_trait_summary: 'test'
          },
          image_generation_prompt: 'test'
        }),
      });
    });

    it('should disable submit button during loading', async () => {
      let resolvePromise: any;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

      render(<QuizPage />);
      
      // Fill all required fields
      fireEvent.change(screen.getByTestId('timeOfDay-input'), { target: { value: 'night' } });
      fireEvent.change(screen.getByTestId('weather-input'), { target: { value: 'stormy' } });
      fireEvent.change(screen.getByTestId('conflictStyle-input'), { target: { value: 'confrontation' } });
      fireEvent.change(screen.getByTestId('snackFlavor-input'), { target: { value: 'sweet' } });
      fireEvent.change(screen.getByTestId('ambition-input'), { target: { value: 'power' } });
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Resolve the promise to clean up
      resolvePromise({
        ok: true,
        json: async () => ({
          assignment_result: {
            assigned_persona: 'Vampire',
            rationale: 'Test',
            core_trait_summary: 'test'
          },
          image_generation_prompt: 'test'
        }),
      });
    });
  });

  describe('Image upload integration', () => {
    it('should render ImageUpload component', () => {
      render(<QuizPage />);
      
      expect(screen.getByTestId('mock-image-upload')).toBeInTheDocument();
    });
  });
});
