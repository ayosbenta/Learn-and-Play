// components/AudioPlayer.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, loop = true, autoplay = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  // Initialize and clean up audio element
  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = loop;
    audioRef.current.volume = 0.3; // So it's background music

    if (autoplay) {
      // Attempt to play on mount, but browsers might block.
      // User interaction will be required to truly start.
      audioRef.current.play().catch(error => {
        console.warn("Autoplay was prevented. User interaction required to play audio.", error);
        setIsPlaying(false);
      });
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, loop, autoplay]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Failed to play audio:", error);
          // If play fails, assume it's still paused.
          setIsPlaying(false);
        });
      }
    }
  }, [isPlaying]);

  return (
    <div className="fixed top-4 right-4 z-30">
      <button
        onClick={togglePlayPause}
        className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
