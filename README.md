# Smart-Device-Management-Platform
This collection contains all the API endpoints for the Smart Device Management Platform.

This project is a robust backend service for a smart device management platform, developed as part of the Curvvtech Backend Developer Assignment. It provides a complete set of APIs for user management, device control, and data analytics, all built with a clean and scalable architecture.

---

## ✨ Features

* **Secure User Authentication**: Full signup and login functionality using JWTs for secure, session-based authentication.
* **Complete Device Management**: Full CRUD (Create, Read, Update, Delete) operations for smart devices.
* **Real-time Device Monitoring**: Includes a heartbeat mechanism to track the `last_active_at` status of devices.
* **Data Logging & Analytics**: Endpoints to log device events and retrieve aggregated usage data over specific time ranges (e.g., last 24 hours).
* **Automated Background Jobs**: A scheduled job runs hourly to automatically deactivate devices that have been inactive for more than 24 hours.
* **Robust Security**: Implements rate limiting to prevent abuse and comprehensive input validation to ensure data integrity.
* **Containerized Environment**: Fully Dockerized with Docker Compose for a consistent, one-command setup process.

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JSON Web Tokens (JWT)
* **Validation**: Joi
* **Containerization**: Docker & Docker Compose
* **Testing**: Jest & Supertest

---

## 🚀 Getting Started

You can run this project either locally on your machine or using the provided Docker setup. Docker is the recommended method.

### Prerequisites

* Node.js (v18 or newer)
* npm
* MongoDB (if running locally)
* Docker Desktop (if using Docker)

### 1. Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd smart-device-management
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root. Copy the contents of `.env.example` and fill in your specific details, especially your `MONGO_URI` and `JWT_SECRET`.
    ```env
    PORT=4000
    MONGO_URI="your-mongodb-connection-string"
    JWT_SECRET="your-super-secret-jwt-key"
    JWT_EXPIRES_IN="1d"
    ```

4.  **Start the server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:4000`.

### 2. Docker Setup (Recommended)

1.  **Ensure Docker is running.**

2.  **Build and run the containers:**
    From the project's root directory, run the following command:
    ```bash
    docker-compose up --build
    ```

3.  The API will be available at `http://localhost:4000`.

---

## 📄 API Documentation

A complete and detailed API specification is provided via the Postman collection.

* **File:** You can find the collection file in the root of this repository: `Smart-Device-Management.postman_collection.json`. Import this file into your Postman client to test all endpoints.
* **Public Link:** You can also view the documentation online at the following public link:
    * [**View Postman Documentation**](https://documenter.getpostman.com/view/40691244/2sB3BHnUov)

### API Endpoint Overview

| Feature             | Endpoint                       | Method | Protected |
| ------------------- | ------------------------------ | ------ | --------- |
| **User Management** | `/api/auth/signup`             | `POST` | No        |
|                     | `/api/auth/login`              | `POST` | No        |
| **Device Management** | `/api/devices`                 | `POST` | Yes       |
|                     | `/api/devices`                 | `GET`  | Yes       |
|                     | `/api/devices/:id`             | `PATCH`| Yes       |
|                     | `/api/devices/:id`             | `DELETE`| Yes       |
|                     | `/api/devices/:id/heartbeat`   | `POST` | Yes       |
| **Data & Analytics**| `/api/devices/:id/logs`        | `POST` | Yes       |
|                     | `/api/devices/:id/logs`        | `GET`  | Yes       |
|                     | `/api/devices/:id/usage`       | `GET`  | Yes       |

---

## 🤔 Assumptions Made

* The default role for any new user signing up is **"user"**.
* The background job to deactivate inactive devices runs **once every hour**.
* The `units_consumed` event is the primary event type used for the usage aggregation endpoint.
