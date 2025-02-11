import React, { useState, useEffect } from 'react';

export const SongEditForm = ({ song, onClose, onUpdateSong }) => {
  const [songName, setSongName] = useState(song.name);
  const [error, setError] = useState('');

  useEffect(() => {
    setSongName(song.name);
  }, [song]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (songName.trim() === '') {
      setError('Song name cannot be empty');
      return;
    }
    if (songName.length > 50) {
      setError('Song name cannot exceed 50 characters');
      return;
    }
    onUpdateSong(song.id, songName);
    setError('');
    onClose();
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Edit Song Name</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-lg mb-2 ml-1">Song Name</label>
          <input 
            className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
            placeholder="Enter Song Name"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
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