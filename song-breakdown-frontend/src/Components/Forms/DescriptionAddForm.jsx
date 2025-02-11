import React, { useState } from 'react';

export const DescriptionAddForm = ({ onClose, onAddDescription }) => {
  const [descriptionName, setDescriptionName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (descriptionName.trim() === '') {
      setError('Description name cannot be empty');
      return;
    }
    if (descriptionName.length > 50) {
      setError('Description name cannot exceed 50 characters');
      return;
    }
    onAddDescription(descriptionName);
    setError(''); 
    onClose();
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Add New Description</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-lg mb-2 ml-1">Description Name</label>
          <input 
            className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
            placeholder="Enter Description Name"
            value={descriptionName}
            onChange={(e) => setDescriptionName(e.target.value)}
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