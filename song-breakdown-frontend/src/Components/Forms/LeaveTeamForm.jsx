import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LeaveTeamForm = ({ onClose, onLeaveTeam, teamName }) => {
  const navigate = useNavigate();

  const handleLeave = async () => {
    try {
      await onLeaveTeam();
      navigate('/teams');
    } catch (error) {
      console.error('Failed to leave team:', error);
    } finally {
      onClose();
    }
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-2">
        Do you want to leave
      </h1>
      <h1 className="text-center text-white text-xl p-1">
        <strong>{teamName}</strong>?
      </h1>
      <div className="flex items-center gap-8 justify-center mt-4">
        <button
          onClick={handleLeave}
          className="bg-[#B90000] hover:bg-[#8B0C0C] text-white font-bold py-2 px-4 rounded"
        >
          Leave
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