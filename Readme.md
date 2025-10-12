# SnipShare

SnipShare is a simple, real-time file-sharing web application that allows users to create private rooms, invite others, and share files instantly.

## Features

* Create Private Rooms: Instantly generate a unique, private room with a shareable ID.
* Real-Time Sharing: Upload and share files with all participants in the room in real-time.
* Simple Drag-and-Drop: Easily upload files using a modern drag-and-drop interface.
* Participant List: See who is currently in the room with you.

## Tech Stack

#### Frontend

* React: A JavaScript library for building user interfaces.
* Vite: A fast and modern frontend build tool.
* Tailwind CSS: A utility-first CSS framework for rapid UI development.

#### Backend

* Node.js: A JavaScript runtime for the server.
* Express.js: A minimal and flexible Node.js web application framework.
* SQLite: A self-contained, serverless SQL database engine.
* Cloudflare R2: S3-compatible object storage for file uploads.

## Getting Started

To get a local copy up and running, follow these simple steps.

#### Prerequisites

* Node.js (v18 or later)
* pnpm (or npm/yarn)

## Installation

#### Clone the repo

> git clone [https://github.com/Shobhan-Patra/Fi-sh.git](https://github.com/Shobhan-Patra/Fi-sh.git)

#### Install Frontend Dependencies

> cd client
> pnpm install

#### Install Backend Dependencies

> cd server
> pnpm install

#### Setup Environment Variables

* Create a .env file in the server directory and add your Cloudflare R2 credentials and other necessary keys.

#### Run the Application

In the client directory, run:

> pnpm run dev

In the server directory, run:

> pnpm run start

If you run into any errors while starting the server, try:

> npm run start

The application will be available at `http://localhost:5173`.
