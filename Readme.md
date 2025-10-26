# SnipShare

SnipShare is a real-time file-sharing web application built to explore full-stack development concepts, including WebSocket communication, object storage, and automated cloud deployment. Snipshare allows users to create unique rooms, invite others via a shareable link, and transfer files instantly without any hassle.

This project was built to explore and implement a full-stack architecture using modern web technologies, including WebSockets, object storage, and a CI/CD pipeline for serverless deployment.

## Features

* **Private Rooms**: Instantly generate a unique, private room with a shareable ID.
* **Real-Time Sharing**: Upload and share files with all participants in the room in real-time.
* **Drag-and-Drop Interface**: Easily upload files using a modern drag-and-drop UI.
* **Participant List**: See who is currently in the room with you.

## Architecture & Tech Stack

The application uses a decoupled frontend and backend. The React client communicates with the Node.js server via a REST API for standard HTTP actions and a persistent WebSocket connection for real-time events.

| Component        | Technology                         | Role                                                        |
| :--------------- | :--------------------------------: | :----------------------------------------------------------:|
| **Frontend**     | React (Vite), Tailwind CSS         | Responsive, client-side UI                                  |
| **Backend**      | Node.js, Express.js                | Lightweight REST API server                                 |
| **Real-time**    | Socket.IO                          | Handles persistent WebSocket connections for live updates   |
| **Database**     | Turso (SQLite)                     | Serverless SQL database storing room & file metadata        |
| **File Storage** | Cloudflare R2                      | S3-compatible object storage for uploaded files             |
| **CI/CD**        | Docker, Google Cloud Build         | Containerizes backend & automates deployment                |
| **Hosting**      | Google Cloud Run, Cloudflare Pages | Serverless hosting for backend and frontend                 |

## Project Structure
```
│  
│   ├── README.md
│   ├── src
│   └── vite.config.js
└── server
    ├── access.log
    ├── config
    |── controllers
    ├── db
    ├── Dockerfile
    ├── local.db
    ├── middlewares
    ├── package.json
    ├── package-lock.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── routes
    ├── server.js
    └── utils
```

## Getting Started

To get a local copy up and running, you can follow the manual installation or use Docker.

#### Prerequisites

* Node.js (v18 or later)
* pnpm (or npm/yarn)
* Docker (for containerized setup)

-----

### 1\. Manual Installation

#### Clone the repo

```bash
git clone https://github.com/Shobhan-Patra/Fi-sh.git
```

#### Install Frontend Dependencies

```bash
cd Fi-sh/client
pnpm install
```

#### Install Backend Dependencies

```bash
cd ../server
pnpm install
```

#### Setup Environment Variables

Create a `.env` file in the `server` directory and add your Cloudflare R2 credentials, database URL, and other necessary keys.

```bash
# .env.example

# Server Configuration
SERVER_PORT=8000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
CRON_SECRET=a_very_secret_string_for_cron_jobs

# Turso Database Credentials
TURSO_DATABASE_URL="your_turso_db_url"
TURSO_AUTH_TOKEN="your_turso_auth_token"

# You can also use Turso locally: 
# https://docs.turso.tech/local-development

# Cloudflare R2 Credentials
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_TOKEN_VALUE=""
```

#### Run the Application

In one terminal, run the client:

```bash
# From the client directory
pnpm run dev
```

In a second terminal, run the server:

```bash
# From the server directory
pnpm run start
```

The application will be available at `http://localhost:5173`.

-----

### 2\. Running Backend with Docker
This method runs the backend server inside a Docker container.
You still need to run the client separately using `pnpm run dev`.

1.  **Navigate to the server directory:**

    ```bash
    cd Fi-sh/server
    ```

2.  **Create your `.env` file** in this directory as described in the manual installation. The Docker container will need it to run correctly.

3.  **Build the Docker image:**

    ```bash
    docker build -t snipshare-server .
    ```

4.  **Run the container:**

    ```bash
    docker run -d -p 8000:8000 --env-file ./.env --name snipshare-container snipshare-server
    ```

    The backend will be running on `http://localhost:8000`. 

## Deployment (CI/CD)

This project is configured for automated, continuous deployment.

* Frontend (Cloudflare Pages): The client directory is connected to Cloudflare Pages. A new version is automatically built and deployed on every git push to the main branch.

* Backend (Google Cloud Run): The server directory is connected to Google Cloud Build. On every git push, Cloud Build:

    * Finds the cloudbuild.yaml file.

    * Builds the Dockerfile into a container image.

    * Pushes the image to Google Artifact Registry.

    * Deploys the new image to the Google Cloud Run service.

    * Injects all production secrets from Google Secret Manager.

## License

This project is open-source and available under the MIT License. See the LICENSE file for more info.