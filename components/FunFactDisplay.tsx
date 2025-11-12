// components/FunFactDisplay.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { getFunFact } from '../services/geminiService';
import Button from './Button';
// Fix: Add missing import for the Card component.
import Card from './Card';

interface FunFactDisplayProps {
  topic?: string;
}

const FunFactDisplay: React.FC<FunFactDisplayProps> = ({ topic = "the world" }) => {
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunFact = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fact = await getFunFact(topic);
      setFunFact(fact);
    } catch (err) {
      setError("Failed to load fun fact. Please try again!");
      console.error("Error in FunFactDisplay:", err);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    fetchFunFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch once on mount

  return (
    <Card className="flex flex-col items-center text-center p-4">
      <h3 className="text-xl md:text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
        <span role="img" aria-label="light bulb">💡</span> Did You Know?
      </h3>
      <div className="min-h-[80px] flex items-center justify-center text-lg text-gray-800 italic">
        {isLoading && <p className="text-blue-500 animate-pulse">Loading a fun fact...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {funFact && !isLoading && !error && <p>"{funFact}"</p>}
      </div>
      <Button
        onClick={fetchFunFact}
        variant="outline"
        size="sm"
        className="mt-4 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'New Fact!'}
      </Button>
    </Card>
  );
};

export default FunFactDisplay;