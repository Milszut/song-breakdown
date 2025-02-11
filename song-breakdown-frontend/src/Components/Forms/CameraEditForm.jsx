import React, { useState, useEffect } from 'react';

export const CameraEditForm = ({ camera, onClose, onUpdateCamera }) => {
  const [cameraName, setCameraName] = useState(camera.name);
  const [error, setError] = useState('');

  useEffect(() => {
    setCameraName(camera.name);
  }, [camera]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (cameraName.trim() === '') {
      setError('Camera name cannot be empty');
      return;
    }
    if (cameraName.length > 50) {
      setError('Camera name cannot exceed 50 characters');
      return;
    }
    onUpdateCamera(camera.id, cameraName);
    setError('');
    onClose();
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Edit Camera Name</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-lg mb-2 ml-1">Camera Name</label>
          <input 
            className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
            placeholder="Enter Camera Name"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex items-center gap-8 justify-center">
          <button
            type="submit"
            className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#CC8111] hover:bg-[#966213] text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};