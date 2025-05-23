# Simple Voting Web3

A decentralized voting application built on Web3 technology that enables users to create proposals, vote on them, and view results in a transparent and secure manner.

## Overview

Simple Voting Web3 is a modern web application that leverages blockchain technology to provide a transparent and tamper-proof voting system. Users can connect their Web3 wallets, create proposals, vote on existing proposals, and view voting results.

## Features

- **Wallet Connection**: Securely connect your Web3 wallet to interact with the application
- **Create Proposal**: Create new voting proposals with customizable parameters
- **View Proposal List**: Browse through all active and past proposals
- **Vote on Proposal**: Cast your vote on active proposals
- **Display Voting Results**: View real-time voting results with visual representations
- **Restrict Re-voting**: Prevent users from voting multiple times on the same proposal
- **End Voting**: Automatically or manually close voting periods and finalize results

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Shadcn UI components
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Data Display**: TanStack Table
- **Web3 Integration**: Wagmi
- **Build Tools**: Vite, Bun
- **Code Quality**: Biome (linting and formatting)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime)
- A Web3 wallet (e.g., MetaMask)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/simple-voting-web3.git
cd simple-voting-web3
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
bun run build
```

## Development

### Code Quality

Maintain code quality by running linting and formatting:

```bash
# Lint the code
bun run lint

# Format the code
bun run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Use conventional Commits!'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the React, Wagmi, and TanStack communities for their excellent libraries
- All contributors who have helped shape this project