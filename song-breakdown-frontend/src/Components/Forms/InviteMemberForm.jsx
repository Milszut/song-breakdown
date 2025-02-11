import React, { useState } from 'react';

export const InviteMemberForm = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email cannot be empty');
      return;
    }

    try {
      await onInvite(email);
      setEmail('');
      onClose();
    } catch (err) {
      setLocalError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-1">Invite New Member</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-lg mb-2 ml-1">User Email</label>
          <input
            type="email"
            className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {localError && <p className="text-red-500 text-sm mt-2">{localError}</p>}
        </div>
        <div className="flex items-center gap-8 justify-center">
          <button
            type="submit"
            className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded"
          >
            Invite
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