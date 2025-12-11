# NFT Collection – ERC‑721 Smart Contract  
(Complete README for Submission)

## Overview
This repository contains a fully functional ERC‑721–compatible NFT smart contract, a complete automated test suite, and a Dockerized environment for reproducible compilation and testing.

The project meets all functional, security, and Dockerization requirements specified in the task description.

---

## Features Implemented
### ✔ ERC‑721 Core Functionality
- Unique token ownership  
- Safe transfers (`safeTransferFrom`)  
- Approvals and operator approvals  
- Metadata via `tokenURI`  
- Accurate per‑address balances  
- Ownership & authorization checks  
- Clear revert reasons  

### ✔ Collection Rules
- Maximum supply enforcement  
- Token ID range validation  
- Double‑mint prevention  
- Burn functionality  
- Read‑only configuration helpers  

### ✔ Access Control
- Owner‑only minting  
- Uses OpenZeppelin `Ownable`  

### ✔ Testing
The test suite covers:
- Minting  
- Transfers  
- Approvals & operator approvals  
- Event validation  
- Invalid scenarios  
- Supply rules  
- Zero‑address checks  
- Gas‑usage measurement  

### ✔ Dockerized Environment
The Dockerfile:
- Installs dependencies  
- Compiles contracts  
- Runs the entire test suite automatically  
- Requires no manual steps  

---

## Project Structure
```
project-root/
│
├── contracts/
│   └── NftCollection.sol
│
├── test/
│   ├── NftCollection.test.js
│   └── Gas.test.js
│
├── Dockerfile
├── .dockerignore
├── package.json
├── hardhat.config.js
├── README.md
```

---

## Prerequisites (Local Use)
- Node.js ≥ 18  
- npm ≥ 8  
- Hardhat  
- Docker Desktop  

---

## Installation
```bash
npm install
```

---

## Running Tests Locally
```bash
npx hardhat test
```

---

## Using Docker

### **Build the Image**
```bash
docker build -t nft-contract .
```

### **Run Tests in Container**
```bash
docker run --rm nft-contract
```

This will automatically:
- Install dependencies  
- Compile the smart contract  
- Execute the entire test suite  

---

## Hardhat Commands
Compile:
```bash
npx hardhat compile
```

Run tests:
```bash
npx hardhat test
```

Clean:
```bash
npx hardhat clean
```

---

## Security Practices
- Owner‑restricted minting  
- Strict input validation  
- No reentrancy vulnerabilities  
- Consistent revert messages  
- Atomic state changes  

---

## Gas Strategy
- Minimal storage writes  
- No loops over token arrays  
- Efficient mint + transfer flow (< acceptable gas threshold)

---

## Dockerfile Summary
The Docker container:
- Installs Node & Hardhat
- Installs all project dependencies
- Compiles all contracts
- Executes the test suite on startup
- Is fully offline and deterministic

---

## Submission Checklist (All Completed)
### ✔ Smart contract implemented  
### ✔ Tests implemented  
### ✔ Dockerfile working  
### ✔ All tests pass  
### ✔ README included  
### ✔ Repo ready for submission  

---

## Author
**Kunisetty Rushikesh**

---

## License
MIT License
