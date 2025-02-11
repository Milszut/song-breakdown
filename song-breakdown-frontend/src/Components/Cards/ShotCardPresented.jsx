import React from 'react';

export const ShotCardPresented = ({ shot, cameras, descriptions, currentDuration }) => {
  const camera = cameras.find(camera => camera.id == shot.camera_id);
  const description = descriptions.find(description => description.id == shot.description_id);
  const elapsedPercentage = ((shot.duration - currentDuration) / shot.duration) * 100;

  return (
    <div className={`relative h-20 lg:h-24 flex rounded-lg items-center justify-center text-white mx-2 lg:mx-20 p-4 lg:p-10 ${camera ? camera.color : 'bg-gray-500'} bg-opacity-35`}>
      <div 
        className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-[100ms] ease-linear origin-left ${camera ? camera.color : 'bg-gray-500'}`}
        style={{ width: `${elapsedPercentage}%` }}>
      </div>

      <div className="relative z-10 flex items-center justify-between w-full">
        <p className="text-white w-30 lg:w-40 text-xl lg:text-3xl font-medium text-center">{camera ? camera.name : 'None'}</p>
        <p className='grow'></p>
        <p className="text-white w-30 lg:w-40 text-xl lg:text-3xl font-medium text-center">{description ? description.name : 'None'}</p>
        <p className='grow'></p>
        <p className="text-white w-30 lg:w-40 text-xl lg:text-3xl font-medium text-right">{currentDuration.toFixed(1)}s</p>
      </div>
    </div>
  );
};