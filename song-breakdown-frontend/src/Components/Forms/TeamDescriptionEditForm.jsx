import React, { useState } from 'react';

export const TeamDescriptionEditForm = ({ currentDescription, onClose, onUpdateDescription }) => {
  const [description, setDescription] = useState(currentDescription || '');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (description.trim() === '') {
      setError('Description cannot be empty');
      return;
    }
    if (description.length > 200) {
      setError('Description cannot exceed 200 characters');
      return;
    }

    onUpdateDescription(description);
    onClose();
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Edit Team Description</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-lg mb-2 ml-1">Team Description</label>
          <textarea
            className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
            placeholder="Enter Team Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
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