import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TeamDeleteForm = ({ team, onClose, onDeleteTeam }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await onDeleteTeam(team.id);
      navigate('/teams');
    } catch (err) {
      console.error('Failed to delete team:', err);
    }
    onClose();
  };
  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Do you want to delete team?</h1>
      <h1 className="text-center text-white text-xl p-1">{team.name}</h1>
      <div className="flex items-center gap-8 justify-center mt-4">
        <button onClick={handleDelete} className="bg-[#B90000] hover:bg-[#8B0C0C] text-white font-bold py-2 px-4 rounded">Delete</button>
        <button onClick={onClose} className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded">Cancel</button>
      </div>
    </div>
  );
};