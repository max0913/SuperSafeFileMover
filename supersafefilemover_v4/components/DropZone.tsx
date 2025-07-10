
import React, { useState } from 'react';
import { Destination } from '../types';
import { FolderIcon, PencilIcon, TrashIcon, ArrowUpTrayIcon, ScissorsIcon } from './Icons';

interface DropZoneProps {
  destination: Destination;
  onDrop: (files: FileList, destinationId: string, move: boolean) => void;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ destination, onDrop, isEditing, onEdit, onDelete }) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isMoveIntent, setIsMoveIntent] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(true);
    // Continuously check shift key state as it can change mid-drag
    if (e.shiftKey !== isMoveIntent) {
        setIsMoveIntent(e.shiftKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);
    setIsMoveIntent(false); // Reset intent when leaving the drop zone
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const isMove = e.shiftKey;
    setIsDraggedOver(false);
    setIsMoveIntent(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files, destination.id, isMove);
      e.dataTransfer.clearData();
    }
  };

  const baseClasses = "relative group flex flex-col items-center justify-center p-4 h-36 rounded-lg border-2 transition-all duration-200 ease-in-out";
  const stateClasses = isDraggedOver 
    ? `border-emerald-500 bg-emerald-900/50 scale-105`
    : "border-dashed border-slate-600 bg-slate-800 hover:border-emerald-600 hover:bg-slate-700/50";

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${baseClasses} ${stateClasses}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <FolderIcon className="w-10 h-10 mb-2 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        <p className="font-semibold text-slate-100 truncate w-full px-2">{destination.name}</p>
        <p className="text-xs text-slate-400 truncate w-full px-2">{destination.path}</p>
        <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Hold Shift to move</p>
      </div>
      {isEditing && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-50 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 rounded-full bg-slate-700 hover:bg-sky-600 text-slate-300 hover:text-white">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {isDraggedOver && (
         <div className="absolute inset-0 bg-emerald-500/20 rounded-lg flex flex-col items-center justify-center p-2 backdrop-blur-sm">
            {isMoveIntent ? (
                <>
                    <ScissorsIcon className="w-12 h-12 text-white drop-shadow-lg" />
                    <p className="text-white font-bold text-lg mt-2">Drop to Move</p>
                </>
            ) : (
                <>
                    <ArrowUpTrayIcon className="w-12 h-12 text-white drop-shadow-lg" />
                    <p className="text-white font-bold text-lg mt-2">Drop to Copy</p>
                </>
            )}
         </div>
      )}
    </div>
  );
};