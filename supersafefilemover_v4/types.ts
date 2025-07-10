
export interface Destination {
  id: string;
  name: string;
  path: string;
}

export type TransferStatus = 'PENDING' | 'COPYING' | 'VERIFYING' | 'MOVING' | 'COMPLETED' | 'FAILED';

export interface FileTransfer {
  id: string;
  fileName: string;
  destinationId: string;
  status: TransferStatus;
  progress: number; // Percentage from 0 to 100
}

export interface LogEntry {
  timestamp: Date;
  level: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN';
  message: string;
}

export interface AppConfig {
    destinations: Destination[];
}
