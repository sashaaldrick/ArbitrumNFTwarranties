require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

module.exports = {
  solidity: "0.8.11",
  paths: {
    artifacts: './src/artifacts', // for React's sake...
  },
  networks: {
    hardhat: {
      chainId: 1337 // localhost chain.
    },
    rinkarby: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      chainId: 421611, // RinkArby chain ID.
    },
  }
};
