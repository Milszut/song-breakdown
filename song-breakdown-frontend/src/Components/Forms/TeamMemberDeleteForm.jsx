import React from 'react';

export const TeamMemberDeleteForm = ({ member, teamName, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(member.id);
    onClose();
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Do you want to remove</h1>
      <h1 className="text-center text-white text-xl p-1">
        <strong>{member.name} {member.lastname}</strong> from <strong>{teamName}</strong> ?
      </h1>
      <div className="flex items-center gap-8 justify-center mt-4">
        <button
          onClick={handleDelete}
          className="bg-[#B90000] hover:bg-[#8B0C0C] text-white font-bold py-2 px-4 rounded"
        >
          Remove
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