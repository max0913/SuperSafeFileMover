import { AppConfig, TransferStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

let config: AppConfig = {
    destinations: [
        { id: uuidv4(), name: 'NAS Media Archive', path: '/Volumes/Media/Archive' },
        { id: uuidv4(), name: 'Work Projects Backup', path: '/Users/Admin/Documents/Work-Backup' },
        { id: uuidv4(), name: 'Camera Card Offload', path: 'D:\\Photography\\New-Imports' },
    ]
};

// Simulate reading config from a file
export const get_config = async (): Promise<AppConfig> => {
    console.log("Mock API: get_config called");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(config))); // Deep copy
        }, 300);
    });
};

// Simulate saving config to a file
export const save_config = async (newConfig: AppConfig): Promise<void> => {
    console.log("Mock API: save_config called with", newConfig);
    return new Promise(resolve => {
        setTimeout(() => {
            config = JSON.parse(JSON.stringify(newConfig)); // Deep copy
            resolve();
        }, 300);
    });
};

// Simulate opening a native file dialog
export const open_file_dialog = async (): Promise<string | null> => {
    console.log("Mock API: open_file_dialog called");
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, this would show a dialog. Here we return a mock path.
            const paths = ['/Users/Shared/New-Destination', 'C:\\Users\\Public\\Documents\\Safe-Folder', '/mnt/data/shared-drive'];
            resolve(paths[Math.floor(Math.random() * paths.length)]);
        }, 100);
    });
};

// Simulate the rsync-based file transfer process
export const perform_transfer = (
    source_paths: string[],
    destination_path: string,
    move_files: boolean,
    onProgress: (log: string, progress: number, status?: TransferStatus) => void
): Promise<void> => {
    console.log(`Mock API: perform_transfer called for ${source_paths[0]} to ${destination_path} (move: ${move_files})`);
    
    // Simulate a pre-flight check that can fail immediately
    const preflightFailureChance = Math.random();
    if (preflightFailureChance < 0.05) { // 5% chance
        return Promise.reject(`Pre-flight check failed: Source file '${source_paths[0]}' is not readable.`);
    }
    if (preflightFailureChance < 0.1) { // 5% chance
        return Promise.reject(`Pre-flight check failed: Destination path '${destination_path}' is inaccessible.`);
    }

    return new Promise((resolve, reject) => {
        const action = move_files ? 'Moving' : 'Copying';
        const fileName = source_paths[0].split(/[\\/]/).pop() || 'file';

        // Simulate some initial delay
        setTimeout(() => {
            onProgress(`${action} ${fileName}...`, 10, move_files ? 'MOVING' : 'COPYING');
        }, 500);

        // Simulate copy progress
        setTimeout(() => {
            onProgress(`Transferring... 50%`, 50, move_files ? 'MOVING' : 'COPYING');
        }, 1500);

        setTimeout(() => {
            onProgress(`Transferring... 99%`, 99, move_files ? 'MOVING' : 'COPYING');
        }, 2500);

        // Simulate checksum verification
        setTimeout(() => {
            onProgress(`Verifying checksum for ${fileName}...`, 99, 'VERIFYING');
        }, 3000);

        // Simulate completion with more varied, realistic errors
        setTimeout(() => {
            const failureChance = Math.random();
            if (failureChance < 0.1) {
                const error = `Permission denied to write to ${destination_path}.`;
                onProgress(`Error: Permission denied.`, 99, 'FAILED');
                reject(error);
            } else if (failureChance < 0.2) {
                const error = `Destination not found at ${destination_path}.`;
                onProgress(`Error: Destination not found.`, 99, 'FAILED');
                reject(error);
            } else if (failureChance < 0.3) {
                const error = `Checksum verification failed for ${fileName}.`;
                onProgress(`Checksum mismatch for ${fileName}!`, 99, 'FAILED');
                reject(error);
            } else {
                onProgress(`Checksum OK. Transfer complete.`, 100, 'COMPLETED');
                if (move_files) {
                    onProgress(`Removing source file ${fileName}.`, 100, 'COMPLETED');
                }
                resolve();
            }
        }, 4000);
    });
};