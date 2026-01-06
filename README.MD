
***

# DevSync 🚀

> **Connect. Collaborate. Create.**  
> A centralized platform for developers to discover open-source projects, build teams, and synchronize their development workflow.

![Project Banner](https://via.placeholder.com/1200x400?text=DevSync+Project+Banner) *<!-- Replace with your actual project screenshot or banner -->*

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 💡 About the Project

**DevSync**  is a real-time collaborative developer platform that enables teams to write code, execute commands, and collaborate live within a shared environment. It features synchronized editors, an integrated terminal for live execution, and WebSocket-driven state sharing to maintain real-time consistency across users. The platform is backed by a scalable Node.js architecture, supports isolated execution using containerized environments, and ensures persistent project state to enable reliable, multi-user collaboration across sessions.

**Live Demo:** [Check out the Project Here](https://portfolio-flame-mu-74.vercel.app/projects/DevSync)


---

## 🚀 Key Features of DevSync

### 1. Real-Time Collaborative Code Editing

* Multiple users can edit the same files simultaneously
* Changes are synced instantly via WebSockets
* Single source of truth maintained by the backend
* Prevents conflicts and ensures consistency across users

---

### 2. Browser-Based Live Terminal (PTY)

* Fully interactive terminal powered by Node PTY
* Real shell behavior (stdin / stdout / signals)
* Supports package installs, builds, and runtime commands
* Runs inside isolated Docker containers for safety

---

### 3. Secure Execution Environment

* Each project runs inside an isolated Docker container
* Ephemeral disk storage reconstructed per session
* No persistent execution state → safer and scalable
* Automatic cleanup on session exit

---

### 4. Intelligent Preview & Port Detection

* Automatically detects running servers (e.g., dev servers)
* Secure preview URLs with token-based access
* Prevents unauthorized port access and leaks
* Supports both static and dynamic web projects

---

### 5. GUI Application Support (Xvfb)

* Supports GUI-based applications inside containers
* Uses Xvfb for virtual display rendering
* GUI access exposed securely via proxy routes
* Enables advanced tooling beyond CLI apps

---

### 6. Project-Centric Architecture

* Projects act as collaboration units
* Files, terminals, chat, and previews are project-scoped
* Clean isolation between different projects
* Easy switching between multiple workspaces

---

### 7. Real-Time Team Chat & Event Broadcast

* Project-level and team-level chat
* Instant broadcast of messages and system events
* Chat is persistent and synchronized
* Enables seamless communication during collaboration

---

### 8. Database-Backed File System

* All file content stored in the database
* Disk is treated as temporary execution space
* Files reconstructed on demand for execution
* Enables serverless-friendly and recoverable workflows

---

### 9. Custom Command Shortcuts

* Run frequently used commands with one click
* Supports custom user-defined commands
* Improves productivity and reduces repetitive typing
* Works seamlessly with the terminal PTY

---

### 10. Clean Frontend–Backend Separation

* Next.js frontend handles UI and lightweight APIs
* Main backend manages real-time logic and persistence
* Execution backend focuses purely on code runtime
* Improves scalability, maintainability, and security

---

### 11. Team & Access Management

* Supports teams and shared projects
* Role-based access to projects
* Controlled collaboration environment
* Ready for future enterprise extensions


---

## 🛠 Tech Stack

**Frontend:**
*   React.js / Next.js
*   Tailwind CSS (Styling)
*   Monoco 
*   Yjs

**Backend:**
*   Node.js & Express.js
*   Prisma / PostgreSQL (Database)
*   Websocket (Real-time communication)

**Tools & Services:**
*   Vercel (Deployment)
*   Cloudinary (Image Storage)
*   Clerk (Authentication)
*   Docker

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rahulCoder9417/dev-sync
    cd DevSync
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add the following variables (see next section).

4.  **Run the application**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication (If using NextAuth/OAuth)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_random_secret_string

# Cloudinary (Optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---



## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📞 Contact

**Your Name**  
*   Portfolio: [Your Portfolio Link](https://portfolio-flame-mu-74.vercel.app/)
*   LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/rahul-kumar-511054360/)
*   Email: rahulkum94l94@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

---
## 👉🏻 Explore More
[DevSync Architecture](./docs/architecture/README.MD)