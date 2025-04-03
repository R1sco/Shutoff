# ShutOff

A lightweight application to remotely shutdown or restart your Windows laptop from an Android device over a local network.

## Components

1. **Node.js Server** - Runs on the Windows laptop
2. **Android Interface** - For sending commands to the server

## Server Setup

1. Make sure Node.js is installed on your laptop
2. Navigate to the `server` directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Edit the `.env` file and replace the `API_KEY` value with your secret key
5. Start the server:
   ```
   npm start
   ```

## Usage

1. Ensure your laptop and Android device are on the same Wi-Fi network
2. Note your laptop's IP address (use `ipconfig` in Windows command prompt)
3. Open the Android app and enter your laptop's IP and API key
4. Use the buttons in the app to shutdown or restart your laptop

## API Endpoints

- `GET /api/status` - Check server status
- `POST /shutdown` - Shutdown the laptop
- `POST /restart` - Restart the laptop
- `POST /cancel` - Cancel pending shutdown/restart command

All POST endpoints require an `x-api-key` header with the correct API key value.

## Security

- Use a strong and complex API key in the `.env` file
- Use only on secure local networks
- Avoid exposing the server port to the public internet
- Never store the `.env` file in your code repository

## Android Options

Use applications like HTTP Request Widget, Tasker, or create a simple custom Android app to send requests to the server. Alternatively, use the included web interface by visiting your server's URL from any browser.

## Running the Server on Windows Startup

To run the server automatically at Windows startup, create a shortcut to the following batch file and place it in the Windows Startup folder:

1. Create a `start_shutoff_server.bat` file with the following content:

   ```batch
   @echo off
   cd /d "PATH_TO_SERVER_DIRECTORY"
   npm start
   ```

2. Replace `PATH_TO_SERVER_DIRECTORY` with the full path to your server directory
3. Press Win+R, type `shell:startup` and press Enter
4. Place the shortcut to the batch file in that folder
