import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";

export const ShotCard = ({ shot, cameras, descriptions, onUpdate, onDelete, currentUserRole }) => {
  const [cameraId, setCameraId] = useState(shot.camera_id);
  const [descriptionId, setDescriptionId] = useState(shot.description_id);
  const [duration, setDuration] = useState(shot.duration);
  const camera = cameras.find((camera) => camera.id == cameraId);
  const description = descriptions.find((desc) => desc.id == descriptionId);

  useEffect(() => {
    setCameraId(shot.camera_id);
    setDescriptionId(shot.description_id);
  }, [shot.camera_id, shot.description_id]);

  const handleCameraChange = (e) => {
    const newCameraId = e.target.value === "None" ? null : e.target.value;
    setCameraId(newCameraId);
    onUpdate(shot.id, newCameraId, descriptionId, duration);
  };

  const handleDescriptionChange = (e) => {
    const newDescriptionId = e.target.value === "None" ? null : e.target.value;
    setDescriptionId(newDescriptionId);
    onUpdate(shot.id, cameraId, newDescriptionId, duration);
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
  
    if (/^\d*\.?\d{0,1}$/.test(newDuration) || newDuration === "") {
      setDuration(newDuration);
    }
  };
  
  const handleDurationBlur = () => {
    if (duration === "") {
      setDuration("0");
      onUpdate(shot.id, cameraId, descriptionId, "0");
    } else {
      const roundedDuration = parseFloat(parseFloat(duration).toFixed(1));
      setDuration(roundedDuration);
      onUpdate(shot.id, cameraId, descriptionId, roundedDuration.toString());
    }
  };

  const handleDelete = () => {
    onDelete(shot.id);
  };

  return (
    <div className="bg-[#201616] bg-opacity-50 w-full gap-1 lg:gap-2 flex rounded-lg items-center justify-center place-items-center text-white p-1 px-2">
        {currentUserRole === 1 || currentUserRole === 2 ? (
        <select className={`text-white bg-[#1A1A1A] rounded-md w-28 lg:w-48 text-center items-center justify-center place-items-center ${camera ? camera.color : 'bg-[#1A1A1A]'}`} value={cameraId !== null ? cameraId : "None"} onChange={handleCameraChange}>
          {cameraId === null && <option value="None">None</option>}
          {cameras.map(camera => (
            <option key={camera.id} value={camera.id}  className={`${camera.color} text-white`}>
              {camera.name}
            </option>
          ))}
        </select>
        ) : (
          <p  className={`${camera.color} text-white w-28 lg:w-48 text-center rounded-md`}>{camera ? camera.name : 'None'}</p>
        )}
        <div className='grow'></div>
        {currentUserRole === 1 || currentUserRole === 2 ? (
        <select className="text-white bg-[#1A1A1A] rounded-md w-28 lg:w-48 text-center items-center justify-center place-items-center" value={descriptionId !== null ? descriptionId : "None"} onChange={handleDescriptionChange}>
          {descriptionId === null && <option value="None">None</option>}
          {descriptions.map(description => (
            <option key={description.id} value={description.id}>
              {description.name}
            </option>
          ))}
        </select>
         ) : (
          <p className="w-28 bg-[#1A1A1A] lg:w-48 lg:ml-20 text-center rounded-md">{description ? description.name : 'None'}</p>
        )}
        <div className='grow pr-10 lg:pr-0'></div>
        {currentUserRole === 1 || currentUserRole === 2 ? (
        <div className='flex'>
          <input
            type="text"
            value={duration}
            onChange={handleDurationChange}
            onBlur={handleDurationBlur} 
            className="bg-[#1A1A1A] w-16 border text-white text-center"
          />
          <IoClose className="text-xl lg:text-3xl hover:cursor-pointer hover:text-red-600" onClick={handleDelete}/>
        </div>
        ) : (
          <div className='flex w-28 lg:w-48 justify-center items-center'>
            <p className="w-20 bg-[#1A1A1A] text-center rounded-md">{duration}</p>
          </div>
        )}
    </div>
  );
};