
import React from 'react';
import { PlusIcon, PencilSquareIcon, CheckCircleIcon } from './Icons';

interface ControlBarProps {
  onAdd: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ onAdd, isEditing, setIsEditing }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isEditing 
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
        }`}
      >
        {isEditing ? <CheckCircleIcon className="w-5 h-5" /> : <PencilSquareIcon className="w-5 h-5" />}
        <span>{isEditing ? 'Done Editing' : 'Edit Destinations'}</span>
      </button>
      <button
        onClick={onAdd}
        className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Add Destination</span>
      </button>
    </div>
  );
};
