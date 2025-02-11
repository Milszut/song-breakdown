import React, { useState, useEffect, useRef } from 'react';
import { ShotCardPresented } from './ShotCardPresented';
import { ShotCardUpcomeing } from './ShotCardUpcomeing';
import { FaPlayCircle } from "react-icons/fa";
import { FaCirclePause } from "react-icons/fa6";

export const PresentMode = ({ shots, cameras, descriptions, selectedSongId, isFormOpen }) => {
  const [activeShots, setActiveShots] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [animateOut, setAnimateOut] = useState(false);
  const timerRef = useRef(null);

  const formatDuration = (value) => parseFloat(value.toFixed(1));

  const handlePlayPause = () => {
    if (isPlaying) {
      handleStop();
    } else {
      handlePlay();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    setCurrentDuration(formatDuration(shots[0]?.duration || 0));
    setAnimateOut(false);
    setActiveShots(shots);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !isFormOpen) { 
        event.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, isFormOpen]);

  useEffect(() => {
    if (isPlaying) {
        handleStop();
    }
  }, [selectedSongId]);


  useEffect(() => {
    setActiveShots(shots);
    setCurrentDuration(formatDuration(shots[0]?.duration || 0));
    setIsPlaying(false);
    setAnimateOut(false);
  }, [shots, selectedSongId]);
  
  useEffect(() => {
    let startTime = null;
    let animationFrameId;
  
    const updateDuration = () => {
      const now = performance.now();
      const elapsedTime = (now - startTime) / 1000;
      const currentShotDuration = activeShots[0]?.duration || 0;
      const newDuration = formatDuration(currentShotDuration - elapsedTime);
  
      if (newDuration > 0) {
        setCurrentDuration(newDuration);
        animationFrameId = requestAnimationFrame(updateDuration);
      } else {
        setCurrentDuration(0);
        setAnimateOut(true);
        setTimeout(() => {
          setAnimateOut(false);
          startTime = performance.now();
          setActiveShots((prevShots) => {
            const [, ...remainingShots] = prevShots;
  
            if (remainingShots.length === 0) {
              handleStop();
              return shots; 
            }
  
            return remainingShots;
          });
  
          setCurrentDuration(formatDuration(activeShots[1]?.duration || 0));
        }, 0);
      }
    };
  
    if (isPlaying && activeShots.length > 0) {
      startTime = performance.now();
      animationFrameId = requestAnimationFrame(updateDuration); 
    }
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeShots, shots]);  

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="flex w-full items-center justify-center place-items-center p-2  lg:p-4">
        <p className="text-gray-400 text-2xl lg:text-3xl font-medium text-center">Currently Running</p>
      </div>
      <div className="flex h-full overflow-y-hidden scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 flex-col gap-3">
        {activeShots.map((shot, index) => (
          index === 0 ? (
            <React.Fragment key={shot.id}>
              <div className={`transition transform duration-500 ease-out ${animateOut ? 'opacity-0 translate-y-[-100%]' : 'opacity-100 translate-y-0'}`}>
                <ShotCardPresented
                  shot={shot}
                  cameras={cameras}
                  descriptions={descriptions}
                  currentDuration={currentDuration}
                />
              </div>
              <div className="flex w-full items-center justify-center place-items-center">
                <p className="text-gray-400 text-2xl lg:text-3xl font-medium text-center">Upcoming</p>
              </div>
            </React.Fragment>
          ) : (
            <div className={`transition transform duration-500 ease-out ${animateOut && index === 1 ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'}`}
                 key={shot.id}>
              <ShotCardUpcomeing
                shot={shot}
                cameras={cameras}
                descriptions={descriptions}
              />
            </div>
          )
        ))}
      </div>
      <div className="flex w-full bg-[#201616] bg-opacity-50 items-center justify-center place-items-center p-2 border-t border-white border-opacity-50">
        {isPlaying ? (
          <FaCirclePause onClick={handlePlayPause} className="text-white text-4xl cursor-pointer" />
        ) : (
          <FaPlayCircle onClick={handlePlayPause} className="text-white text-4xl cursor-pointer" />
        )}
      </div>
    </div>
  );
};