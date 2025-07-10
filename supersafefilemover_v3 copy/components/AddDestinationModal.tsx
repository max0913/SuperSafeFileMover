
import React, { useState, useEffect } from 'react';
import * as mockApi from '../services/mockTauriApi';
import { Destination } from '../types';
import { FolderOpenIcon, XMarkIcon } from './Icons';

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, path: string) => void;
  destination: Destination | null;
}

export const AddDestinationModal: React.FC<AddDestinationModalProps> = ({ isOpen, onClose, onSave, destination }) => {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  useEffect(() => {
    if (destination) {
      setName(destination.name);
      setPath(destination.path);
    } else {
      setName('');
      setPath('');
    }
  }, [destination, isOpen]);

  const handleSelectFolder = async () => {
    const selectedPath = await mockApi.open_file_dialog();
    if (selectedPath) {
      setPath(selectedPath);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && path) {
      onSave(name, path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{destination ? 'Edit Destination' : 'Add New Destination'}</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="dest-name" className="block text-sm font-medium text-slate-300 mb-1">Destination Name</label>
              <input
                id="dest-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., 'Work Archive'"
                className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label htmlFor="dest-path" className="block text-sm font-medium text-slate-300 mb-1">Folder Path</label>
              <div className="flex space-x-2">
                <input
                  id="dest-path"
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/path/to/your/folder"
                  className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  required
                />
                <button type="button" onClick={handleSelectFolder} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-200">
                  <FolderOpenIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-md text-white font-semibold">
              {destination ? 'Save Changes' : 'Add Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
