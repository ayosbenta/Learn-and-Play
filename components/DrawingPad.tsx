// components/DrawingPad.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import { LearningCompletionCallback, LearningActivityType } from '../types';

interface DrawingPadProps {
  onDrawingComplete: LearningCompletionCallback;
  onBack: () => void;
}

const DrawingPad: React.FC<DrawingPadProps> = ({ onDrawingComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false); // Track if anything has been drawn

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth; // Make canvas responsive to parent width
        canvas.height = Math.min(400, parent.clientWidth * 0.75); // Max 400px height, maintain aspect ratio
      }

      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = '#3B82F6'; // Blue color for drawing
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      onDrawingComplete(10, LearningActivityType.DRAWING_PAD, "Cleared drawing");
    }
  }, [onDrawingComplete]);

  const saveDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'my-masterpiece.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDrawingComplete(20, LearningActivityType.DRAWING_PAD, "Saved drawing");
    }
  }, [onDrawingComplete]);

  const handleBack = useCallback(() => {
    onDrawingComplete(0, LearningActivityType.DRAWING_PAD, "Exited drawing pad"); // Award 0 XP for just exiting
    onBack();
  }, [onDrawingComplete, onBack]);

  return (
    <Card className="p-4 md:p-6 flex flex-col items-center max-w-4xl mx-auto w-full">
      <h3 className="text-3xl font-extrabold text-orange-700 mb-4">Unleash Your Creativity! 🎨</h3>
      <p className="text-gray-700 mb-6 text-lg">Draw anything you imagine on the canvas below.</p>

      <div className="bg-white border-4 border-blue-400 rounded-lg overflow-hidden shadow-xl w-full max-w-2xl mb-6">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing} // Also stop drawing if mouse leaves canvas
          className="block touch-none" // Prevent default touch behavior
          role="img"
          aria-label="Drawing canvas"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button onClick={clearCanvas} variant="outline" icon={<span role="img" aria-label="broom">🧹</span>}>
          Clear Canvas
        </Button>
        <Button onClick={saveDrawing} variant="primary" icon={<span role="img" aria-label="save">💾</span>} disabled={!hasDrawn}>
          Save Drawing
        </Button>
      </div>
      <Button onClick={handleBack} variant="secondary" size="sm">
        Back to Learning Hub
      </Button>
    </Card>
  );
};

export default DrawingPad;