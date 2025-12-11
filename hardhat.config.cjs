require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20" }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
