import React from 'react';

export const EventDeleteForm = ({ eventName, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Are you sure you want to delete:</h1>
      <h1 className="text-center text-white text-xl p-1">{eventName}</h1>
      <div className="flex items-center gap-8 justify-center mt-4">
        <button
          onClick={handleDelete}
          className="bg-[#B90000] hover:bg-[#8B0C0C] text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};