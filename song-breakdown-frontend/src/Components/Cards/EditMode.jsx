import React from 'react';
import { ShotCard } from './ShotCard';

export const EditMode = ({ shots, cameras, descriptions, handleUpdateShot, handleDeleteShot, totalDuration, currentUserRole }) => {

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="px-4 pr-9 lg:pr-12 lg:pl-10 flex p-2 lg:p-3 w-full bg-[#201616] bg-opacity-50 gap-2 items-center justify-center place-items-center text-white border-b border-white border-opacity-50">
        <p className="text-white text-md lg:text-xl font-medium text-center">Camera Name</p>
        <p className='grow'></p>
        <p className="pl-0 lg:pl-24 text-white text-md lg:text-xl font-medium text-center">Shot Description</p>
        <div className='grow flex justify-end'>
          <p className="text-white text-md lg:text-xl font-medium text-center">Duration</p>
        </div>
        <p className="text-white text-md lg:text-xl font-medium text-center">({totalDuration}s)</p>
      </div>
      <div className="flex overflow-y-auto scrollbar scrollbar-w-0.5 lg:scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 p-1 flex-col gap-2">
        {shots.map(shot => (
          <ShotCard
            key={shot.id}
            shot={shot}
            cameras={cameras}
            descriptions={descriptions}
            onUpdate={handleUpdateShot}
            onDelete={handleDeleteShot}
            currentUserRole={currentUserRole}
          />
        ))}
      </div>
    </div>
  );
};