import React, { useState, useEffect } from 'react';
import { fetchSongs } from '../../Services/songService';
import { IoAddCircle } from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";

export const EventSongAddForm = ({ teamId, eventSongs, onAddSongToEvent, onClose }) => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const teamSongs = await fetchSongs(teamId);
        setSongs(teamSongs);
      } catch (err) {
        console.error("Error fetching team songs:", err);
        setError('Failed to load songs');
      }
    };

    loadSongs();
  }, [teamId]);

  const handleAddSong = (songId) => {
    onAddSongToEvent(songId);
  };

  const isSongInEvent = (songId) => {
    return eventSongs.some(eventSong => eventSong.id === songId);
  };

  return (
    <div className='flex flex-col h-96 overflow-auto'>
      <h1 className="text-center text-white text-3xl font-bold p-2">Add Songs to Event</h1>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div className="overflow-y-auto p-2 flex flex-col gap-2 scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className="flex justify-between items-center bg-[#1A1A1A] p-2 rounded-lg text-white"
          >
            <p className="text-lg font-medium">{song.name}</p>
            {isSongInEvent(song.id) ? (
                <IoCheckmarkCircle className="text-[#58C134] text-3xl" />
            ) : (
                <IoAddCircle className="text-white text-3xl cursor-pointer hover:text-[#30980C]" onClick={() => handleAddSong(song.id)} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button 
          onClick={onClose}
          className="bg-[#CC8111] hover:bg-[#966213] text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};