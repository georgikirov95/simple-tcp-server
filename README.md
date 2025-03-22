# TCP File Transfer Server & Client

This project is a simple TCP-based file transfer system. The client sends a file to the server over a TCP connection, and the server saves it to a designated storage folder.

## Features
- Supports file transfer over TCP
- Handles backpressure to prevent memory overflow
- Ensures secure file storage
- Handles errors gracefully

## Requirements
- Node.js (v14 or later)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/georgikirov95/simple-tcp-server.git
   cd tcp-file-transfer
   ```
3. Create storage folder
    ```sh
    mkdir storage
    ```

## Usage

### Start the Server
Run the server script to listen for connections:
```sh
node server.js
```
The server will start on `127.0.0.1:3000`.

### Send a File (Client)
Use the client script to send a file:
```sh
node client.js path/to/file.txt
```

## How It Works
1. The client reads the file and sends it in chunks to the server.
2. The server extracts the filename and stores the data in the `./storage/` directory.
3. The client gracefully handles backpressure and closes the connection when done.

## Error Handling
- If the server crashes or the connection is lost, the file stream will be closed safely.
- If the file doesn't exist, the client will display an error message.