import React, { useState } from 'react';

export const CreateTeamForm = ({ onClose, onCreate }) => {
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (teamName.trim() === '') {
            setError('Team name cannot be empty');
            return;
        }
        if (teamName.length > 50) {
            setError('Team name cannot exceed 50 characters');
            return;
        }
        if (teamDescription.length > 150) {
            setError('Team description cannot exceed 150 characters');
            return;
        }
        onCreate({ name: teamName, description: teamDescription });
        setError('');
        onClose();
    };

    return (
        <div>
            <h1 className="text-center text-white text-3xl font-bold p-1">Create New Team</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Team Name</label>
                    <input
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Enter Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Team Description (max 150 characters)</label>
                    <textarea
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Enter Team Description"
                        value={teamDescription}
                        maxLength={150}
                        rows={4}
                        onChange={(e) => setTeamDescription(e.target.value)}
                    />
                    {teamDescription.length > 150 && (
                        <p className="text-red-500 text-sm mt-2">
                            Team description cannot exceed 150 characters.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-8 justify-center">
                    <button
                        type="submit"
                        className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded"
                    >
                        Create
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