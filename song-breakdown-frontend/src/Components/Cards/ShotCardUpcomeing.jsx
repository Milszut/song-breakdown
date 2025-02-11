import React from 'react';

export const ShotCardUpcomeing = ({ shot, cameras, descriptions }) => {
  const camera = cameras.find(camera => camera.id == shot.camera_id);
  const description = descriptions.find(description => description.id == shot.description_id);
  
  return (
    <div className={`h-10 lg:h-16 flex rounded-lg items-center justify-center place-items-center text-white mx-6 lg:mx-40 border-1 border-white p-2 lg:p-10 bg-opacity-90 ${camera ? camera.color : 'bg-gray-500'}`}>
      <p className="text-white w-30 lg:w-40 text-xl lg:text-3xl font-medium rounded-md text-center items-center justify-center place-items-center"> {camera ? camera.name : 'None'}</p>
      <div className='grow'></div>
      <p className="text-white w-30 lg:w-40 text-xl lg:text-3xl font-medium rounded-md text-center items-center justify-center place-items-center">{description ? description.name : 'None'}</p>
      <div className='grow'></div>
      <p className="text-white w-30 lg:w-40 text-xl lg:text-3xl font-medium w-16 text-right">{shot.duration}s</p>
    </div>
  );
};