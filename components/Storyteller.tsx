// components/Storyteller.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './Card';
import Button from './Button';
import { generateStorySegment } from '../services/geminiService';
import { LearningCompletionCallback, LearningActivityType, StorySegment } from '../types';
import { MASCOT_IMAGE_URL, MASCOT_NAME } from '../constants';

interface StorytellerProps {
  onStoryComplete: LearningCompletionCallback;
  onBack: () => void;
  maxStorySegments?: number; // Max segments before story ends
}

const genres = ['Adventure', 'Fantasy', 'Animal Story', 'Space Quest'];

const Storyteller: React.FC<StorytellerProps> = ({ onStoryComplete, onBack, maxStorySegments = 5 }) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [storyHistory, setStoryHistory] = useState<StorySegment[]>([]);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);

  const fetchStorySegment = useCallback(async (choice?: string) => {
    if (!selectedGenre) return;

    setIsLoading(true);
    setError(null);
    setCurrentChoices([]); // Clear choices while loading next segment
    try {
      const newSegment = await generateStorySegment(selectedGenre, storyHistory, choice);
      if (newSegment) {
        setStoryHistory(prev => [...prev, newSegment]);
        setCurrentChoices(newSegment.choices || []);
      }
    } catch (err) {
      setError("Luno forgot his lines! Couldn't continue the story. Try picking a different genre.");
      console.error("Error in Storyteller:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre, storyHistory]);

  useEffect(() => {
    // Scroll to bottom when new story segment arrives
    storyTextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [storyHistory]);

  const startStory = (genre: string) => {
    setSelectedGenre(genre);
    setStoryHistory([]);
    fetchStorySegment();
  };

  const handleChoice = (choice: string) => {
    if (isLoading) return;
    fetchStorySegment(choice);
  };

  const handleContinue = () => {
    if (isLoading) return;
    fetchStorySegment();
  };

  const finishStory = useCallback(() => {
    onStoryComplete(storyHistory.length * 20, LearningActivityType.INTERACTIVE_STORY, selectedGenre || 'unknown');
    setStoryHistory([]);
    setSelectedGenre(null);
    onBack();
  }, [onStoryComplete, onBack, storyHistory.length, selectedGenre]);

  const handleBackToHub = useCallback(() => {
    onStoryComplete(0, LearningActivityType.INTERACTIVE_STORY, "Exited story early");
    setStoryHistory([]);
    setSelectedGenre(null);
    onBack();
  }, [onBack, onStoryComplete]);

  if (!selectedGenre) {
    return (
      <Card className="p-4 md:p-6 flex flex-col items-center max-w-2xl mx-auto w-full">
        <h3 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
          Choose Your Story Adventure! 📖
        </h3>
        <p className="text-gray-700 mb-6 text-lg">What kind of story do you want to hear today?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          {genres.map(genre => (
            <Button
              key={genre}
              onClick={() => startStory(genre)}
              variant="secondary"
              size="lg"
            >
              {genre}
            </Button>
          ))}
        </div>
        <Button onClick={onBack} variant="outline" size="sm" className="mt-6">
          Back to Learning Hub
        </Button>
      </Card>
    );
  }

  const isStoryComplete = storyHistory.length >= maxStorySegments && currentChoices.length === 0;

  return (
    <Card className="p-4 md:p-6 flex flex-col items-center max-w-3xl mx-auto w-full">
      <h3 className="text-3xl font-extrabold text-green-700 mb-4 text-center">
        Luno's {selectedGenre} Story! ✨
      </h3>
      <div className="relative w-full h-96 bg-green-50 rounded-lg p-4 overflow-y-auto shadow-inner mb-6 hide-scrollbar">
        {storyHistory.map((segment, index) => (
          <div key={index} className="mb-4 text-lg text-gray-800 leading-relaxed">
            <span className="font-semibold text-green-800">{MASCOT_NAME}: </span>
            {segment.text}
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 text-lg text-gray-800 leading-relaxed animate-pulse">
            <span className="font-semibold text-green-800">{MASCOT_NAME} is thinking of the next part...</span>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
        <div ref={storyTextRef} />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        {currentChoices.length > 0 && !isStoryComplete && !isLoading ? (
          <>
            <p className="text-xl font-bold text-blue-700 text-center mb-2">What happens next?</p>
            {currentChoices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleChoice(choice)}
                variant="primary"
                size="md"
                disabled={isLoading}
              >
                {choice}
              </Button>
            ))}
          </>
        ) : isStoryComplete ? (
          <Button onClick={finishStory} variant="primary" size="lg">
            Finish Story & Collect XP!
          </Button>
        ) : (
          <Button onClick={handleContinue} variant="secondary" size="md" disabled={isLoading}>
            Continue Story
          </Button>
        )}

        <Button onClick={handleBackToHub} variant="outline" size="sm" disabled={isLoading} className="mt-2">
          Back to Learning Hub
        </Button>
      </div>
    </Card>
  );
};

export default Storyteller;