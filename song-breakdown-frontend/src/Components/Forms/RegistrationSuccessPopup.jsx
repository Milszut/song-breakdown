import React from 'react';

export const RegistrationSuccessPopup = ({ onClose }) => {
  return (
    <div>
      <h1 className="text-center text-white text-3xl font-bold p-2">
        Registration Successful!
      </h1>
      <p className="text-center text-white text-md p-2">
        You can now Sign In to your account.
      </p>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={onClose}
          className="bg-[#58C134] hover:bg-[#30980C] text-white font-bold py-2 px-4 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};