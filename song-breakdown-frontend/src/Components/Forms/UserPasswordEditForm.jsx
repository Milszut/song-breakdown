import React, { useState } from 'react';

export const UserPasswordEditForm = ({ onClose, onUpdatePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (newPassword !== confirmNewPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }

        try {
            await onUpdatePassword({ currentPassword, newPassword, confirmNewPassword });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <h1 className="text-center text-white text-3xl font-bold p-1">Change Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Current Password</label>
                    <input
                        type="password"
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Enter Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">New Password</label>
                    <input
                        type="password"
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-lg mb-2 ml-1">Confirm New Password</label>
                    <input
                        type="password"
                        className="bg-[#1A1A1A] rounded-lg w-full p-2 text-white"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='flex flex-col pb-4'>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </div>
                <div className="flex items-center gap-8 justify-center">
                    <button type="submit" className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                    <button type="button" onClick={onClose} className="bg-[#CC8111] hover:bg-[#966213] text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};