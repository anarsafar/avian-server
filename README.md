<div align="center">
  <h1>Avian Messaging Server</h1>
</div>

<div align="left">
  <p>A modern Node.js Express API for a real-time chat application. This API is equipped with JWT authentication, social login capabilities using Passport.js, and data validation powered by Zod. It seamlessly integrates WebSocket support for instant, interactive communication between users.</p>
</div>

## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Introduction](#introduction)
-   [Key Features](#key-features)
-   [Used Technologies](#used-technologies)
-   [Getting Started](#getting-started)
-   [RoadMap](#roadmap)
-   [Bugs](#bugs)
-   [Contact](#contact)

## Introduction

Avian Messaging Server is the backend infrastructure powering the Avian Messaging application. It provides a robust API for handling user authentication, message delivery, and various other
functionalities required for real-time communication.

## Key Features

-   **JWT Authentication**: Secure user authentication using JSON Web Tokens (JWT) ensures the integrity and confidentiality of user data.
-   **Social Login Integration**: Seamless integration with social login providers such as Facebook, Google, and GitHub allows users to sign in using their preferred platform.
-   **Password Security**: Passwords are securely hashed to prevent unauthorized access to user accounts, ensuring data protection.
-   **Token-Based Authorization**: Access and refresh tokens are utilized for authentication, providing secure and scalable user access management.
-   **Real-Time Communication**: Integration with Socket.IO enables real-time communication between users, facilitating instant messaging and interactive features.
-   **Data Validation**: Input data is validated using Zod, ensuring data integrity and preventing common security vulnerabilities.
-   **RESTful API**: Exposes a RESTful API for handling CRUD operations and other application functionalities.
-   **Scheduled Tasks**: Utilizes node-schedule for scheduling recurring tasks, such as periodic database cleanup or notification dispatch.

## Used Technologies

-   Node.js
-   Express.js
-   MongoDB
-   JWT
-   Passport.js
-   Socket.IO
-   Zod
-   SendGrid
-   and many more...

## Getting Started

Before starting you need node.js installed in your machine. To set up the Avian Messaging Server locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/anarsafar/avian-server.git
    ```

2. Add all necessary keys accoring to `.env.example` file.
3. Run the server:
    ```bash
    npm i
    npm run dev
    ```

## RoadMap

This section contains future updates that we plan to implement:

-   [ ] Server side caching
-   [ ] Handling notification location on server side
-   [ ] reply to a message
-   [ ] send a image
-   [ ] group chat

## Bugs

If you encounter any bugs or issues, please report them with anarsferov@gmail.com.

## Contact

For further inquiries or assistance, feel free to reach out: Anar Safarov - anarsferov@gmail.com
