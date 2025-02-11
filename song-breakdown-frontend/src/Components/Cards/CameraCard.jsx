import React, { useState } from 'react';
import { FaCamera } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const colors = [
  { name: 'White', bg: 'bg-white', text: 'text-black' },
  { name: 'Black', bg: 'bg-black', text: 'text-white' },
  { name: 'Blue', bg: 'bg-sky-400', text: 'text-white' },
  { name: 'Green', bg: 'bg-green-400', text: 'text-white' },
  { name: 'Yellow', bg: 'bg-yellow-300', text: 'text-black' },
  { name: 'Red', bg: 'bg-red-400', text: 'text-white' },
  { name: 'Orange', bg: 'bg-orange-400', text: 'text-white' },
  { name: 'Purple', bg: 'bg-purple-500', text: 'text-white' },
  { name: 'Pink', bg: 'bg-pink-400', text: 'text-black' },
];

export const CameraCard = ({ camera, onDelete, onEdit, onUpdateColor, currentUserRole }) => {

  const [selectedColor, setSelectedColor] = useState(
    colors.find(c => c.bg === camera.color) || colors[0]
  );

  const handleDelete = () => {
    onDelete(camera.id);
  };

  const handleEdit = () => {
    onEdit(camera);
  };

  const handleColorChange = (event) => {
    const selectedBg = event.target.value;
    const newColor = colors.find(c => c.bg === selectedBg);
    if (newColor) {
      setSelectedColor(newColor);
      onUpdateColor(camera.id, selectedBg);
    }
  };

  return (
    <div className={`w-full h-6 gap-2 flex items-center justify-center text-white`}>
      <FaCamera className="text-2xl" />
      <p className="grow">{camera.name}</p>

      <div className={`w-4 h-4 cursor-pointer border ${selectedColor.bg}`} />
      {(currentUserRole === 1 || currentUserRole === 2) && (
        <>
        <select
          className={`bg-transparent border w-20 rounded-md text-center`}
          value={selectedColor.bg}
          onChange={handleColorChange}
        >
          {colors.map(colorObj => (
            <option
              key={colorObj.bg}
              value={colorObj.bg}
              className={`${colorObj.text} ${colorObj.bg}`}
            >
              {colorObj.name}
            </option>
          ))}
        </select>
        <div className='flex gap-1'>
          <MdEdit className="text-xl hover:cursor-pointer hover:text-red-600" onClick={handleEdit} />
          <FaTrash className="text-lg hover:cursor-pointer hover:text-red-600" onClick={handleDelete} />
        </div>
        </>
      )}
    </div>
  );
};