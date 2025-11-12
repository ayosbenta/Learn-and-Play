// components/InteractiveLesson.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './Card';
import Button from './Button';
import { generateLessonSegment } from '../services/geminiService';
import { LearningCompletionCallback, LearningActivityType, LessonSegment } from '../types';
import { MASCOT_IMAGE_URL, MASCOT_NAME } from '../constants';

interface InteractiveLessonProps {
  topicId: string;
  topicTitle: string;
  onLessonComplete: LearningCompletionCallback;
  onBack: () => void;
  numSegments?: number; // Total number of lesson segments
}

const InteractiveLesson: React.FC<InteractiveLessonProps> = ({
  topicId,
  topicTitle,
  onLessonComplete,
  onBack,
  numSegments = 5,
}) => {
  const [lessonHistory, setLessonHistory] = useState<LessonSegment[]>([]);
  const [currentLessonText, setCurrentLessonText] = useState<string>('');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [lessonRound, setLessonRound] = useState(0); // Current segment count
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchLessonSegment = useCallback(async (question?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSegment = await generateLessonSegment(topicTitle, lessonHistory, question);
      setCurrentLessonText(newSegment);
      setLessonHistory(prev => [...prev, { speaker: 'luno', text: newSegment }]);
      if (!question) { // Only increment round if it's a new lesson segment, not a question answer
        setLessonRound(prev => prev + 1);
      }
    } catch (err) {
      setError("Luno got a little shy! Couldn't load the lesson. Please try again.");
      console.error("Error in InteractiveLesson:", err);
    } finally {
      setIsLoading(false);
    }
  }, [topicTitle, lessonHistory]);

  useEffect(() => {
    // Start the first segment when the component mounts
    if (lessonHistory.length === 0) {
      fetchLessonSegment();
    }
  }, [fetchLessonSegment, lessonHistory]);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lessonHistory]);

  const handleNextSegment = () => {
    if (lessonRound < numSegments) {
      setCurrentLessonText(''); // Clear current text for new segment loading
      fetchLessonSegment();
    } else {
      // Lesson complete!
      onLessonComplete(100, LearningActivityType.INTERACTIVE_LESSON, topicTitle);
      onBack();
    }
  };

  const handleAskLuno = async () => {
    if (!userQuestion.trim() || isLoading) return;

    const questionToSend = userQuestion.trim();
    setLessonHistory(prev => [...prev, { speaker: 'user', text: questionToSend }]);
    setUserQuestion('');
    await fetchLessonSegment(questionToSend);
  };

  const handleBack = () => {
    onLessonComplete(0, LearningActivityType.INTERACTIVE_LESSON, "Exited lesson early");
    onBack();
  };

  const isLessonComplete = lessonRound >= numSegments;

  return (
    <Card className="p-4 md:p-6 flex flex-col items-center max-w-3xl mx-auto w-full">
      <h3 className="text-3xl font-extrabold text-blue-700 mb-4 text-center">
        Interactive Lesson: {topicTitle}
      </h3>
      <div className="relative w-full h-80 bg-blue-50 rounded-lg p-4 overflow-y-auto shadow-inner mb-6 hide-scrollbar">
        {lessonHistory.map((segment, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${segment.speaker === 'luno' ? '' : 'justify-end'}`}
          >
            {segment.speaker === 'luno' && (
              <img
                src={MASCOT_IMAGE_URL}
                alt={MASCOT_NAME}
                className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0 border-2 border-blue-400"
              />
            )}
            <div
              className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                segment.speaker === 'luno'
                  ? 'bg-white text-gray-800 border border-blue-200'
                  : 'bg-purple-200 text-purple-900'
              }`}
            >
              {segment.text}
            </div>
            {segment.speaker === 'user' && (
              <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center ml-3 flex-shrink-0 text-xl font-bold">
                😊
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center mb-4">
            <img
              src={MASCOT_IMAGE_URL}
              alt={MASCOT_NAME}
              className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0 border-2 border-blue-400"
            />
            <div className="max-w-[80%] p-3 rounded-xl shadow-md bg-white text-gray-800 border border-blue-200 animate-pulse">
              Luno is thinking...
            </div>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
        <div ref={chatEndRef} />
      </div>

      {!isLessonComplete && (
        <div className="flex w-full gap-2 mb-4">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskLuno()}
            placeholder="Ask Luno a question..."
            className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <Button onClick={handleAskLuno} variant="primary" size="md" disabled={isLoading || !userQuestion.trim()}>
            Ask Luno
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        {isLessonComplete ? (
          <Button onClick={handleBack} variant="primary" size="md">
            Lesson Complete! Back to Hub
          </Button>
        ) : (
          <Button onClick={handleNextSegment} variant="secondary" size="md" disabled={isLoading}>
            {lessonRound === 0 ? 'Start Lesson' : 'Next Lesson Part'} ({lessonRound}/{numSegments})
          </Button>
        )}
        {!isLessonComplete && (
          <Button onClick={handleBack} variant="outline" size="md" disabled={isLoading}>
            Exit Lesson
          </Button>
        )}
      </div>
    </Card>
  );
};

export default InteractiveLesson;