const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper to assert reverts and optionally check substring(s) or custom error names
async function expectRevert(promise, expectedMsgSubstring) {
  try {
    await promise;
    throw new Error("Expected revert but transaction succeeded");
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (expectedMsgSubstring) {
      if (Array.isArray(expectedMsgSubstring)) {
        const found = expectedMsgSubstring.some(sub => msg.includes(sub));
        if (!found) {
          throw new Error("Revert reason didn't include any expected substring. Got: " + msg);
        }
      } else {
        if (!msg.includes(expectedMsgSubstring)) {
          throw new Error("Revert reason didn't include expected substring. Got: " + msg);
        }
      }
    }
  }
}

// helper: find events by name in receipt
function findEvents(receipt, name) {
  if (!receipt || !receipt.events) return [];
  return receipt.events.filter(e => e.event === name);
}

describe("NftCollection - extended", function () {
  let Nft, nft, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    Nft = await ethers.getContractFactory("NftCollection");
    nft = await Nft.deploy("MyNFT", "MNFT", 100, "https://example.com/meta/");
    await nft.deployed();
  });

  it("mint emits Transfer from zero and sets owner/balance/totalSupply", async function () {
    const tx = await nft.safeMint(addr1.address, 10);
    const rcpt = await tx.wait();
    const transfers = findEvents(rcpt, "Transfer");
    expect(transfers.length).to.be.greaterThan(0);
    const transfer = transfers[0];
    expect(transfer.args.from).to.equal(ethers.constants.AddressZero);
    expect(transfer.args.to).to.equal(addr1.address);
    expect((await nft.totalSupply()).toNumber()).to.equal(1);
    expect(await nft.ownerOf(10)).to.equal(addr1.address);
    expect((await nft.balanceOf(addr1.address)).toNumber()).to.equal(1);
  });

  it("approve allows approved to transfer and emits Approval event", async function () {
    await nft.safeMint(addr1.address, 11);
    const approveTx = await nft.connect(addr1).approve(addr2.address, 11);
    const rcpt = await approveTx.wait();
    const approvals = findEvents(rcpt, "Approval");
    expect(approvals.length).to.be.greaterThan(0);
    expect(await nft.getApproved(11)).to.equal(addr2.address);

    await nft.connect(addr2).transferFrom(addr1.address, addr3.address, 11);
    expect(await nft.ownerOf(11)).to.equal(addr3.address);
  });

  it("setApprovalForAll permits operator to move multiple tokens and emits ApprovalForAll", async function () {
    await nft.safeMint(addr1.address, 21);
    await nft.safeMint(addr1.address, 22);

    const tx = await nft.connect(addr1).setApprovalForAll(addr2.address, true);
    const rcpt = await tx.wait();
    const afs = findEvents(rcpt, "ApprovalForAll");
    expect(afs.length).to.be.greaterThan(0);

    await nft.connect(addr2).transferFrom(addr1.address, addr3.address, 21);
    await nft.connect(addr2).transferFrom(addr1.address, addr3.address, 22);
    expect(await nft.ownerOf(21)).to.equal(addr3.address);
    expect(await nft.ownerOf(22)).to.equal(addr3.address);
  });

  it("transfer to zero address reverts", async function () {
    await nft.safeMint(addr1.address, 31);
    // Accept either the standard ERC721 revert string or OZ custom error name
    await expectRevert(
      nft.connect(addr1).transferFrom(addr1.address, ethers.constants.AddressZero, 31),
      ["transfer to the zero address", "ERC721InvalidReceiver"]
    );
  });

  it("burn by token owner removes ownership and decreases totalSupply", async function () {
    await nft.safeMint(addr1.address, 41);
    expect((await nft.totalSupply()).toNumber()).to.equal(1);

    await nft.connect(addr1).burn(41);
    expect((await nft.totalSupply()).toNumber()).to.equal(0);

    expect(await nft.exists(41)).to.equal(false);

    // ownerOf for non-existent token may revert with standard string or custom error name
    await expectRevert(nft.ownerOf(41), ["owner query for nonexistent token", "ERC721NonexistentToken"]);
  });

  it("repeated approvals and revocations behave correctly", async function () {
    await nft.safeMint(addr1.address, 51);

    await nft.connect(addr1).approve(addr2.address, 51);
    expect(await nft.getApproved(51)).to.equal(addr2.address);

    await nft.connect(addr1).approve(ethers.constants.AddressZero, 51);
    expect(await nft.getApproved(51)).to.equal(ethers.constants.AddressZero);

    await nft.connect(addr1).setApprovalForAll(addr2.address, true);
    expect(await nft.isApprovedForAll(addr1.address, addr2.address)).to.equal(true);
    await nft.connect(addr1).setApprovalForAll(addr2.address, false);
    expect(await nft.isApprovedForAll(addr1.address, addr2.address)).to.equal(false);
  });
});
