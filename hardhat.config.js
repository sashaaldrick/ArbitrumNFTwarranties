require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();


module.exports = {
  solidity: "0.8.11",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkarby: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      // url: 'https://arb-rinkeby.g.alchemy.com/v2/59N05fl2PXyqH9L6WXuZppaZURlqsOho',
      chainId: 421611,
      // gas: 19872795,
      // gasPrice: 29872795
    },
  }
};