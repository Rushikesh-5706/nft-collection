const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas usage", function () {
  it("mint + transfer gas should be within expected bounds", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Nft = await ethers.getContractFactory("NftCollection");
    // deploy with larger maxSupply so we can pick tokenIds safely
    const nft = await Nft.deploy("GasNFT", "GNFT", 1000, "https://example.com/meta/");
    await nft.deployed();

    // Mint gas measurement
    const mintTx = await nft.safeMint(addr1.address, 777);
    const mintRcpt = await mintTx.wait();
    const mintGas = mintRcpt.gasUsed.toNumber();

    // Transfer gas measurement (transferFrom by owner of token -> addr2)
    const transferTx = await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 777);
    const transferRcpt = await transferTx.wait();
    const transferGas = transferRcpt.gasUsed.toNumber();

    console.log("mintGas:", mintGas, "transferGas:", transferGas);

    // Reasonable thresholds (implementation dependent) - adjust if necessary
    // Mint often ~100k-200k; transfer often ~40k-100k depending on receiver checks.
    expect(mintGas).to.be.lessThan(300000, "mint gas too high");
    expect(transferGas).to.be.lessThan(150000, "transfer gas too high");
  });
});
