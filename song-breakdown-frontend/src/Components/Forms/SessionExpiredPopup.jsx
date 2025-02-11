import React from 'react';

export const SessionExpiredPopup = ({ onClose }) => {
  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-2">
        Session Expired
      </h1>
      <p className="text-center text-white text-md p-2">
        Your session has expired.<br />Please sign in again to continue.
      </p>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={onClose}
          className="bg-[#B90000] hover:bg-[#990000] text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};