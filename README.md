# OP_NET Predict — Bitcoin L1 Prediction Markets

A prediction market platform built on Bitcoin L1 using the OP_NET metaprotocol.

## Project Structure

```
├── frontend/          # Next.js web application
│   ├── src/
│   │   ├── app/       # Pages (home, market detail, profile)
│   │   ├── components/# UI components (Navbar, MarketCard, WalletProvider)
│   │   ├── services/  # Contract ABI, wallet integration, mock data
│   │   └── types/     # TypeScript interfaces
│   └── ...
├── contracts/         # OP_NET smart contract (AssemblyScript)
│   ├── src/           # Contract source (PredictionMarket.ts)
│   ├── build/         # Compiled .wasm output
│   └── abis/          # Generated ABI files
└── netlify.toml       # Netlify deployment config
```

## Getting Started

### Prerequisites

- Node.js >= 20
- [OP Wallet](https://opnet.org) browser extension

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
npm run dev
```

### Smart Contract

```bash
cd contracts
npm install
npm run build
# Deploy build/PredictionMarket.wasm via OP Wallet
```

## Deployment (Netlify)

1. Push this repo to GitHub
2. Connect the repository in [Netlify](https://app.netlify.com)
3. Netlify will auto-detect `netlify.toml` and build from `frontend/`
4. Set environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` — your deployed contract address
   - `NEXT_PUBLIC_OPNET_RPC_URL` — RPC endpoint (default: `https://testnet.opnet.org`)

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Blockchain**: OP_NET (Bitcoin L1 metaprotocol)
- **Smart Contract**: AssemblyScript compiled to WebAssembly
- **Wallet**: OP Wallet (browser extension)
