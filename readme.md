# AI Travel Planner Demo

## Overview

This project is a demonstration of an AI-powered travel planner application. It showcases how modern AI can transform user experience (UX) in real-time, allowing users to create, modify, and interact with travel itineraries through a conversational interface.

The application leverages the [Vercel AI SDK](https://sdk.vercel.ai/) in combination with custom tools to provide a dynamic, interactive, and highly adaptive travel planning experience. Users can request itinerary changes, add or remove activities, and perform various operations—all through natural language conversation.

## Key Features

- **Conversational Itinerary Planning:** Users interact with the AI to build and modify travel plans in real time.
- **Tool-Driven Operations:** The AI is enhanced with tools that allow it to perform concrete actions (e.g., adding, removing, or updating itinerary items) based on user requests.
- **Streaming Responses:** The application supports streaming, ensuring that users receive real-time feedback and updates as the AI processes their requests.
- **Evolving UX:** Demonstrates how AI can mutate and adapt the user experience over time, making the interface more intuitive and responsive.

## Architecture

To simulate a real-world scenario, the application is architected with a **fully decoupled frontend and backend**:

- **Frontend:** Handles the conversational UI, streams responses from the backend, and provides a seamless user experience.
- **Backend:** Exposes APIs powered by the Vercel AI SDK and custom tools, processes user requests, and manages itinerary data.
- **Streaming Capabilities:** Despite the decoupling, the system maintains streaming communication between frontend and backend, ensuring low-latency, real-time updates.

This separation allows for scalability, flexibility, and easier maintenance, while still delivering a highly interactive and responsive application.

## Getting Started

1. **Start Redis with Docker Compose**

   ```bash
   docker-compose up redis
   ```

2. **Install dependencies**

   - Backend:
     ```bash
     cd app/backend
     pnpm install
     ```
   - Frontend:
     ```bash
     cd app/frontend
     pnpm install
     ```

3. **Run the application**
   - Start the backend server:
     ```bash
     cd app/backend
     pnpm dev
     ```
   - Start the frontend development server:
     ```bash
     cd app/frontend
     pnpm dev
     ```
   - Access the app in your browser and start planning your next trip with AI!

## Demo Use Cases

- "create a 7 days to rome"
- "Add colosseum at day 4"
- "Send me a recap at 3331234567"

## Why This Demo?

This project is designed to inspire developers and product teams to rethink how AI can be integrated into applications—not just as a backend service, but as a core driver of user experience and interface evolution.

## Deployment Architecture

- **Frontend**

  - Deployed on Vercel
  - Provides the conversational UI
  - Streams responses from the backend

- **Backend**

  - Deployed on Vercel
  - Exposes APIs powered by Vercel AI SDK and custom tools
  - Handles itinerary logic and user requests

- **Persistence**
  - Uses Vercel Redis extension
  - Stores itineraries and related data for fast, scalable access

**Schematic Overview:**

```
[User]
   │
   ▼
[Frontend (Vercel)] ⇄ [Backend (Vercel)] ⇄ [Redis (Vercel Extension)]
```

- All components are managed within the Vercel ecosystem for seamless deployment, scalability, and real-time operations.
