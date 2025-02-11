import React from 'react';
import { BsMusicNote } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export const SongCard = ({ song, onDelete, onEdit, onClick, selectedSongId, currentUserRole}) => {
  const handleDelete = () => {
    onDelete(song.id);
  };

  const handleEdit = () => {
    onEdit(song);
  };

  const handleClick = () => {
    onClick(song);
  };

  return (
    <div
      className={`hover:cursor-pointer rounded-lg p-1 px-2 w-full gap-2 flex items-center justify-center place-items-center text-white ${selectedSongId === song.id ? 'bg-white bg-opacity-20' : ''}`}onClick={handleClick}>
      <BsMusicNote className="text-2xl" />
      <p className="grow">{song.name}</p>
      {(currentUserRole === 1 || currentUserRole === 2) && (
      <div className='flex gap-1'>
        <MdEdit className="text-xl hover:cursor-pointer hover:text-red-600" onClick={handleEdit} />
        <FaTrash className="text-lg hover:cursor-pointer hover:text-red-600" onClick={handleDelete} />
      </div>
      )}
    </div>
  );
};
