import React from 'react';

export const Error = ({ message, onClose }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "blurbackground") onClose();
  };

  return (
    <div
      id="blurbackground"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div className="bg-[#292929] bg-opacity-80 rounded-lg p-6 items-center mt-20 justify-center place-items-center">
        <p className="text-white text-xl font-medium mb-4">{message}</p>
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={onClose}
            className="bg-[#CC8111] hover:bg-[#966213] text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};