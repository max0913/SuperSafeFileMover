
import React, { useState, useEffect, useCallback } from 'react';
import { Destination, FileTransfer, LogEntry } from './types';
import * as mockApi from './services/mockTauriApi';
import { DestinationView } from './components/DestinationView';
import { ControlBar } from './components/ControlBar';
import { LogPanel } from './components/LogPanel';
import { AddDestinationModal } from './components/AddDestinationModal';
import { TransferProgress } from './components/TransferProgress';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentTransfers, setCurrentTransfers] = useState<FileTransfer[]>([]);
  const [logHistory, setLogHistory] = useState<LogEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  const addLog = useCallback((level: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN', message: string) => {
    setLogHistory(prev => [...prev, { timestamp: new Date(), level, message }]);
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      addLog('INFO', 'Application started. Loading configuration...');
      try {
        const config = await mockApi.get_config();
        setDestinations(config.destinations);
        addLog('SUCCESS', `Configuration loaded successfully. Found ${config.destinations.length} destinations.`);
      } catch (error) {
        addLog('ERROR', `Failed to load configuration: ${error}`);
      }
    };
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDestinations = async (newDestinations: Destination[]) => {
      try {
          await mockApi.save_config({ destinations: newDestinations });
          setDestinations(newDestinations);
          addLog('SUCCESS', 'Destinations saved successfully.');
      } catch (error) {
          addLog('ERROR', `Failed to save destinations: ${error}`);
      }
  };

  const handleDrop = (files: FileList, destinationId: string, move: boolean) => {
    const destination = destinations.find(d => d.id === destinationId);
    if (!destination) {
      addLog('ERROR', `Invalid destination ID received: ${destinationId}`);
      return;
    }

    const actionText = move ? 'move' : 'copy';
    addLog('INFO', `Initiating ${actionText} of ${files.length} item(s) to "${destination.name}".`);
    
    const sourcePaths = Array.from(files).map(f => (f as any).path || f.name);

    for(const path of sourcePaths) {
        const transferId = uuidv4();
        const newTransfer: FileTransfer = {
            id: transferId,
            fileName: path.split(/[\\/]/).pop() || 'unknown file',
            destinationId: destination.id,
            status: 'PENDING',
            progress: 0
        };
        setCurrentTransfers(prev => [...prev, newTransfer]);
        
        mockApi.perform_transfer([path], destination.path, move, (log, progress, status) => {
            addLog('INFO', `[${destination.name}] ${log}`);
            setCurrentTransfers(prev => prev.map(t => 
                t.id === transferId ? { ...t, progress: progress, status: status ?? t.status } : t
            ));
        }).then(() => {
            addLog('SUCCESS', `Successfully transferred ${path} to ${destination.name}.`);
            setCurrentTransfers(prev => prev.map(t => t.id === transferId ? { ...t, progress: 100, status: 'COMPLETED' } : t));
        }).catch((err) => {
            addLog('ERROR', `Transfer failed for ${path}: ${err}`);
            setCurrentTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'FAILED' } : t));
        });
    }
  };

  const handleAddDestination = () => {
    setEditingDestination(null);
    setIsModalOpen(true);
  };

  const handleEditDestination = (id: string) => {
    const destToEdit = destinations.find(d => d.id === id);
    if(destToEdit) {
      setEditingDestination(destToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDeleteDestination = (id: string) => {
    const destName = destinations.find(d => d.id === id)?.name;
    const newDests = destinations.filter(d => d.id !== id);
    saveDestinations(newDests);
    addLog('WARN', `Destination "${destName}" removed.`);
  };

  const handleSaveDestination = async (name: string, path: string) => {
    if (editingDestination) {
      const updatedDests = destinations.map(d => d.id === editingDestination.id ? { ...d, name, path } : d);
      await saveDestinations(updatedDests);
      addLog('INFO', `Destination "${name}" updated.`);
    } else {
      const newDest = { id: uuidv4(), name, path };
      await saveDestinations([...destinations, newDest]);
      addLog('INFO', `Destination "${name}" added.`);
    }
    setIsModalOpen(false);
    setEditingDestination(null);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex justify-between items-center pb-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-100">SuperSafeFileMover</h1>
        </div>
        <ControlBar 
            onAdd={handleAddDestination}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        />
      </header>

      <main className="flex-grow flex flex-col space-y-6">
        <DestinationView 
          destinations={destinations}
          onDrop={handleDrop}
          isEditing={isEditing}
          onEditDestination={handleEditDestination}
          onDeleteDestination={handleDeleteDestination}
        />

        <TransferProgress transfers={currentTransfers} destinations={destinations} />
      </main>

      <footer className="flex-shrink-0">
        <LogPanel logs={logHistory} />
      </footer>

      <AddDestinationModal 
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingDestination(null);
        }}
        onSave={handleSaveDestination}
        destination={editingDestination}
      />
    </div>
  );
}