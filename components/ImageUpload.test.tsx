/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUpload from './ImageUpload';

describe('ImageUpload Component', () => {
  let mockOnImageSelect: jest.Mock;

  beforeEach(() => {
    mockOnImageSelect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('File validation', () => {
    it('should reject non-image files', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const textFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [textFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Please upload a valid image file (JPG, PNG, or WebP)'
        );
      });
      
      expect(mockOnImageSelect).not.toHaveBeenCalled();
    });

    it('should accept JPG files', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const jpgFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [jpgFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      await waitFor(() => {
        expect(mockOnImageSelect).toHaveBeenCalledWith(jpgFile);
      });
    });

    it('should accept PNG files', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const pngFile = new File(['image content'], 'test.png', { type: 'image/png' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [pngFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      await waitFor(() => {
        expect(mockOnImageSelect).toHaveBeenCalledWith(pngFile);
      });
    });

    it('should accept WebP files', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const webpFile = new File(['image content'], 'test.webp', { type: 'image/webp' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [webpFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      await waitFor(() => {
        expect(mockOnImageSelect).toHaveBeenCalledWith(webpFile);
      });
    });
  });

  describe('Preview display', () => {
    it('should display preview after valid upload', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const imageFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onloadend: null as any,
        result: 'data:image/jpeg;base64,mockbase64data',
      };
      
      (global as any).FileReader = jest.fn(() => mockFileReader);
      
      Object.defineProperty(fileInput, 'files', {
        value: [imageFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      // Simulate FileReader completion
      if (mockFileReader.onloadend) {
        mockFileReader.onloadend();
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('preview-container')).toBeInTheDocument();
        expect(screen.getByTestId('preview-image')).toBeInTheDocument();
      });
    });

    it('should show drop zone when no image is uploaded', () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
      expect(screen.queryByTestId('preview-container')).not.toBeInTheDocument();
    });
  });

  describe('Missing image handling', () => {
    it('should handle missing image gracefully', () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
      expect(screen.getByText(/Drop your photo here or click to upload/i)).toBeInTheDocument();
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    it('should allow removing uploaded image', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const imageFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onloadend: null as any,
        result: 'data:image/jpeg;base64,mockbase64data',
      };
      
      (global as any).FileReader = jest.fn(() => mockFileReader);
      
      Object.defineProperty(fileInput, 'files', {
        value: [imageFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      // Simulate FileReader completion
      if (mockFileReader.onloadend) {
        mockFileReader.onloadend();
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('preview-container')).toBeInTheDocument();
      });
      
      const removeButton = screen.getByTestId('remove-button');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
        expect(screen.queryByTestId('preview-container')).not.toBeInTheDocument();
      });
      
      expect(mockOnImageSelect).toHaveBeenCalledWith(null);
    });
  });

  describe('Drag and drop', () => {
    it('should handle drag over event', () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.dragOver(dropZone);
      
      expect(dropZone).toHaveClass('border-neon-violet');
    });

    it('should handle drag leave event', () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.dragOver(dropZone);
      expect(dropZone).toHaveClass('border-neon-violet');
      
      fireEvent.dragLeave(dropZone);
      expect(dropZone).not.toHaveClass('border-neon-violet');
    });

    it('should handle file drop', async () => {
      render(<ImageUpload onImageSelect={mockOnImageSelect} currentImage={null} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      const imageFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
      
      const dropEvent = {
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [imageFile],
        },
      };
      
      fireEvent.drop(dropZone, dropEvent);
      
      await waitFor(() => {
        expect(mockOnImageSelect).toHaveBeenCalledWith(imageFile);
      });
    });
  });
});
