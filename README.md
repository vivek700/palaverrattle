# Palaverrattle - Realtime Web Chat App

Palaverrattle is a realtime web chat application built using **Next.js** with **Pusher** for real-time communication, **Upstash Redis** as the database, and authentication powered by Google Provider. This project demonstrates how to create a modern, scalable, and user-friendly chat app.

---

## Features

- **Real-time Messaging**: Instant updates using Pusher for seamless communication.
- **Google Authentication**: Secure and simple authentication using Google.
- **Scalable Database**: Upstash Redis for fast and reliable data storage.
- **User-Friendly Interface**: Built with the latest React and Next.js features.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Real-Time Communication**: [Pusher](https://pusher.com/)
- **Database**: [Upstash Redis](https://upstash.com/)
- **Authentication**: [Auth.js](https://authjs.dev/) with Google Provider
- **Styling**: TailwindCSS 

---

## Setup and Installation

### Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Pusher account
- Upstash Redis account
- Google API credentials

### Clone the Repository
```bash
git clone https://github.com/vivek700/palaverrattle.git
cd palaverrattle
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## How It Works

1. **Authentication**: Users sign in with their Google accounts using NextAuth.js.
2. **Real-Time Messaging**:
   - Messages are sent to the server and broadcasted using Pusher.
   - All connected clients receive real-time updates.
3. **Data Storage**: Messages and metadata are stored in Upstash Redis for quick access.

---

## Deployment

Palaverrattle is deployed on Vercel. Visit the live app at [your-deployment-url](https://palaverrattle.vercel.app).

---


Thank you for checking out Palaverrattle!

