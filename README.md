# 🎮 Quiz Quest

> A real-time multiplayer trivia battle game where knowledge meets strategy. Answer questions faster to earn power points, then use them to attack opponents, shield yourself, or force others to skip questions. The last player standing wins!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 What is Quiz Quest?

Quiz Quest is an open-source, real-time multiplayer trivia game that combines quick thinking with strategic gameplay. It's not just about knowing the answers—it's about answering fast, managing your resources, and outsmarting your opponents.

### Game Mechanics

- **Trivia Questions**: Answer multiple-choice questions from various categories
- **Speed Matters**: Answer faster to earn more power points (up to 20 points for instant answers)
- **Strategic Actions**: Spend power points on:
  - **Attack** 💥: Deal damage to opponents and drain their power points
  - **Shield** 🛡️: Protect yourself from incoming attacks
  - **Skip** ⏭️: Force an opponent to skip the next question
- **Health System**: Start with 100 health—lose it all and you're eliminated
- **Last Player Standing**: Survive until the end to claim victory!

## 🏗️ Architecture

This is a TypeScript monorepo built with modern tools and best practices:

```
questionable-mono/
├── apps/
│   ├── frontend/          # React + TypeScript + Vite + Tailwind CSS
│   ├── game-server/       # WebSocket game server (Node.js + TypeScript)
│   └── question-service/  # REST API for trivia questions (Express + TypeScript)
└── packages/
    └── shared/            # Shared types and utilities
```

### Tech Stack

**Frontend:**

- React 19 with TypeScript
- Vite for blazing-fast development
- Tailwind CSS for styling
- Jotai for state management
- WebSocket client for real-time communication

**Backend:**

- Node.js with TypeScript
- WebSocket server for game logic
- Express 5 for REST API
- TSyringe for dependency injection
- Winston for structured logging

**DevOps & Tooling:**

- Turborepo for monorepo management
- Biome for formatting and linting
- pnpm for efficient package management
- Docker support for containerization

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9.15.0+ (install via `npm install -g pnpm@9.15.0`)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/questionable-mono.git
cd questionable-mono

# Install dependencies
pnpm install
```

### Environment Setup

Before running the project, you'll need to set up environment variables:

```bash
# Copy the example environment file for the question service
cp apps/question-service/.env.example apps/question-service/.env
```

The `.env.example` file includes:

- `OPEN_TDB_API` - Open Trivia Database API URL (default: `https://opentdb.com/api.php`)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (default: debug)
- `CORS_ORIGIN` - CORS allowed origin (default: \*)

You can customize these values in the `.env` file as needed.

### Development

Start all services in development mode:

```bash
pnpm dev
```

This will start:

- Frontend on `http://localhost:5173` (or your configured port)
- Game server on `ws://localhost:8080`
- Question service on `http://localhost:3000`

### Building

Build all packages and apps:

```bash
pnpm build
```

### Other Commands

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format

# Type check all packages
pnpm type-check

# Run tests
pnpm test
```

## 🎯 How to Play

1. **Join a Lobby**: Enter a lobby ID and your name
2. **Wait for Players**: Minimum 2 players required to start
3. **Get Ready**: Click "Ready" when you're prepared
4. **Answer Questions**: Answer as fast as possible to earn power points
5. **Use Strategy**: Spend power points on attacks, shields, or skips
6. **Survive**: Keep your health above 0 and be the last player standing!

## 📁 Project Structure

```
.
├── apps/
│   ├── frontend/              # React frontend application
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── store.ts       # State management
│   │   │   └── useGameSocket.ts # WebSocket hook
│   │   └── Dockerfile         # Frontend container
│   ├── game-server/           # WebSocket game server
│   │   ├── src/
│   │   │   ├── game.ts        # Core game logic
│   │   │   ├── gameManager.ts # Game session management
│   │   │   └── lobbyManager.ts # Lobby management
│   │   ├── game-config.yml    # Game configuration
│   │   └── Dockerfile         # Game server container
│   └── question-service/      # REST API for questions
│       ├── src/
│       │   ├── services/      # Business logic
│       │   └── routes/        # API routes
│       └── Dockerfile         # Question service container
├── packages/
│   └── shared/                # Shared types and utilities
│       └── src/
│           ├── types.ts       # TypeScript types
│           └── messages.ts    # WebSocket message types
├── docker-compose.yml         # Docker Compose configuration
├── turbo.json                 # Turborepo configuration
└── biome.json                 # Biome configuration
```

## ⚙️ Configuration

Game mechanics can be customized via `apps/game-server/game-config.yml`:

- Player starting health
- Power point rewards (min/max, time thresholds)
- Action costs and effects
- Number of questions per game
- Question categories and providers

## 🐳 Docker Deployment

Deploy the entire stack with Docker Compose:

```bash
docker-compose up
```

Or build individual services:

```bash
# Frontend
docker build -f apps/frontend/Dockerfile -t questionable-frontend .

# Game Server
docker build -f apps/game-server/Dockerfile -t questionable-game-server .

# Question Service
docker build -f apps/question-service/Dockerfile -t questionable-question-service .
```

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or improvements to documentation, we'd love to have your help.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License allows anyone to use, modify, and distribute this code for any purpose, including commercial use, with minimal restrictions.

## 🙏 Acknowledgments

- Questions powered by [Open Trivia Database](https://opentdb.com/)
- Built with love for trivia enthusiasts and competitive gamers

---

**Made with ❤️ by the open source community**
