import React from 'react';
import { BsCardText } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export const DescriptionCard = ({ description, onDelete, onEdit, currentUserRole }) => {
  const handleDelete = () => {
    onDelete(description.id);
  };

  const handleEdit = () => {
    onEdit(description);
  };

  return (
    <div className="w-full h-6 gap-2 flex items-center justify-center text-white">
      <BsCardText className="text-2xl" />
      <p className="grow">{description.name}</p>
      {(currentUserRole === 1 || currentUserRole === 2) && (
        <div className='flex gap-1'>
          <MdEdit className="text-xl hover:cursor-pointer hover:text-red-600" onClick={handleEdit} />
          <FaTrash className="text-lg hover:cursor-pointer hover:text-red-600" onClick={handleDelete} />
        </div>
      )}
    </div>
  );
};