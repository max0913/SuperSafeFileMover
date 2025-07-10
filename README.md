# **SuperSafeFileMover**

A utility for moving and copying files with post-transfer checksum verification.

## **Purpose**

Standard file transfer operations in most operating systems do not typically perform a byte-for-byte verification after a copy is completed. This creates a risk of silent data corruption, where a file at the destination is not an identical replica of the source due to network errors, storage faults, or other issues. Such errors can go undetected until the original source data is no longer available.

SuperSafeFileMover is a focused utility designed to mitigate this risk. It ensures data integrity by performing a cryptographic checksum on both the source and destination files after every transfer. A transfer is only considered successful if the checksums match.

## **Core Features**

* **Verified Transfers:** Every copy and move operation is followed by a checksum verification to ensure bit-for-bit integrity.  
* **Drag-and-Drop Interface:** A simple, single-window application with configurable "drop zones" for predefined destinations.  
* **Configurable Destinations:** A user-managed list of target folders for frequent transfer operations.  
* **Transaction Logging:** A human-readable log file provides an audit trail of all transfer operations, including source, destination, timestamp, and verification status.  
* **Cross-Platform:** Built with the Tauri framework for lightweight deployment on macOS, Windows, and Linux.  
* **Open Source:** Available under the MIT License.

## **Intended Use Cases**

This tool is designed for any scenario where the integrity of copied data is critical:

* Offloading media from camera cards to primary storage or an archive.  
* Archiving critical research data or project files.  
* Migrating important files between systems or to network-attached storage.  
* Any backup or transfer process where a verified, identical copy is required.

## **Technical Implementation**

The verification process is handled by rsync using the \--checksum (-c) flag. This forces rsync to compute and compare a checksum for every file transferred, rather than relying on the default check of modification time and file size. While this method is more computationally intensive, it provides a high degree of confidence in the integrity of the transferred file.

## **Contributing**

This is an open-source project. Contributions, bug reports, and suggestions are welcome. Please use the issue tracker or submit a pull request.

## **License**

This project is licensed under the MIT License.
