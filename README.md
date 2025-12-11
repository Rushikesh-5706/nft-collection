
# NftCollection (ERC-721) — Smart Contract + Automated Tests + Docker

This repository implements an ERC‑721–compatible NFT contract with:

- Owner‑only minting (`safeMint`)
- Max supply restriction
- Pausable minting
- ERC‑721 approvals + operator approvals
- Burn support with supply tracking
- Metadata via base URI (`tokenURI`)
- Full Hardhat automated test suite (minting, transfers, approvals, burns, gas checks)
- Dockerfile that runs the entire test suite automatically

## Usage (Local)

### Install dependencies
npm install --legacy-peer-deps

### Compile
npx hardhat compile

### Run tests
npx hardhat test

## Docker (Recommended for submission)

### Build container
docker build -t nft-contract .

### Run tests inside container
docker run --rm nft-contract

## Repository Structure
contracts/
    NftCollection.sol
test/
    NftCollection.test.js
    Gas.test.js
hardhat.config.cjs
Dockerfile
.gitignore
LICENSE

## Notes
- Compatible with Hardhat 2.x toolchain
- Uses OpenZeppelin ERC721 standard implementation
- Tests include behavior + failures + gas usage
- Container is fully offline, meeting all requirements
