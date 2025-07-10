
import React from 'react';
import { Destination } from '../types';
import { DropZone } from './DropZone';

interface DestinationViewProps {
  destinations: Destination[];
  onDrop: (files: FileList, destinationId: string, move: boolean) => void;
  isEditing: boolean;
  onEditDestination: (id: string) => void;
  onDeleteDestination: (id: string) => void;
}

export const DestinationView: React.FC<DestinationViewProps> = ({ destinations, onDrop, isEditing, onEditDestination, onDeleteDestination }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Drop Zones</h2>
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <DropZone
              key={dest.id}
              destination={dest}
              onDrop={onDrop}
              isEditing={isEditing}
              onEdit={() => onEditDestination(dest.id)}
              onDelete={() => onDeleteDestination(dest.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-600 rounded-lg">
          <p className="text-slate-400">No destinations configured.</p>
          <p className="text-slate-500 text-sm mt-1">Click "Add Destination" to get started.</p>
        </div>
      )}
    </div>
  );
};