# TrashGrounds Mobile app

This repository contains the mobile application for **TrashGrounds**, a music streaming service built using Expo and React Native. The app connects to the backend to allows users to upload and listen to music, add posts, and write comments.

You can find the backend repository for **TrashGrounds** [here](https://github.com/W1ngshot/TrashGrounds.Microservices).

## Prerequisites

Before running the Expo app, you need to have the backend running. The backend is containerized using Docker, and you can use Docker Compose to set it up.

### Requirements:
- Docker
- Docker Compose
- Node.js (for running the Expo app)

## Setup Instructions

### 1. Setting Up the Backend

To get the backend up and running, follow these steps:

**1. Navigate to the root folder of the project (where the `docker` directory is located).**
**2. Run the following command to start the backend services:**

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This command will:
- Set up and start the backend services in detached mode.
- Run the necessary containers (e.g., database, API, etc.) defined in the docker-compose.yml  file.

**3. Verify that the backend is running by checking the logs or by accessing the API endpoints.**

### 2. Setting Up the Expo Mobile App

Once the backend is up and running, you can start the Expo mobile app:

**1. Navigate to the trashgrounds directory (where the Expo app is located).**
**2. Install the necessary dependencies:**

```bash
npm install
```

**3. Start the Expo app using the following command:**

```bash
npx expo start
```

This will:
- Open the Expo developer tools in your browser.
- Start the app, and you can use the QR code to run it on your mobile device with the Expo Go app, or run the app on an emulator.