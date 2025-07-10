
import React from 'react';
import { FileTransfer, Destination, TransferStatus } from '../types';
import { CheckCircleIcon, ClockIcon, DocumentArrowDownIcon, ExclamationCircleIcon, FolderIcon, ArrowPathIcon } from './Icons';

interface TransferProgressProps {
    transfers: FileTransfer[];
    destinations: Destination[];
}

const getStatusIcon = (status: TransferStatus) => {
    switch (status) {
        case 'PENDING':
            return <ClockIcon className="w-5 h-5 text-slate-400" />;
        case 'COPYING':
        case 'MOVING':
            return <ArrowPathIcon className="w-5 h-5 text-sky-400 animate-spin" />;
        case 'VERIFYING':
            return <DocumentArrowDownIcon className="w-5 h-5 text-amber-400" />;
        case 'COMPLETED':
            return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
        case 'FAILED':
            return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
        default:
            return null;
    }
};

const getStatusColor = (status: TransferStatus) => {
    switch (status) {
        case 'COMPLETED':
            return 'bg-emerald-500';
        case 'FAILED':
            return 'bg-red-500';
        default:
            return 'bg-sky-500';
    }
};


export const TransferProgress: React.FC<TransferProgressProps> = ({ transfers, destinations }) => {
    const activeTransfers = transfers.filter(t => t.status !== 'COMPLETED' && t.status !== 'FAILED');
    
    if (activeTransfers.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Active Transfers</h2>
            <div className="space-y-4">
                {activeTransfers.map(transfer => {
                    const destination = destinations.find(d => d.id === transfer.destinationId);
                    return (
                        <div key={transfer.id} className="bg-slate-800 p-3 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3 min-w-0">
                                    <span className="flex-shrink-0">{getStatusIcon(transfer.status)}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-100 truncate">{transfer.fileName}</p>
                                        <div className="flex items-center text-xs text-slate-400 space-x-1">
                                            <FolderIcon className="w-3 h-3"/>
                                            <span className="truncate">{destination?.name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-slate-300">{transfer.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(transfer.status)}`}
                                    style={{ width: `${transfer.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-center mt-1 text-slate-400 capitalize">{transfer.status.toLowerCase()}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
