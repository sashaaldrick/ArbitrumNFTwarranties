const { arbLog, requireEnvVariables } = require('./arb-shared-dependencies');
requireEnvVariables(['DEVNET_PRIVKEY', 'RINKARBY_API_KEY', 'INFURA_API_KEY']);

require('dotenv').config();
const { ethers } = require("ethers");
const hre = require("hardhat");

const addresses = [
    "0x2008aC70B2920c9A345Ea7fff1DEd1FD4302Bdf0", //RinkArby 1
    "0x8a31a948523A767560a1E715e19DDF205dF9B119", // RinkArby 2
    "0xc76d289179FA31f8d5BC860cc9eDfaf120C19a2B", //RinkArby 3
    "0xbf9cF9Eb09DadC79D310612F824f0ECEBDc3a053", // RinkArby 4
    "0x0F6a8f8e4f59109D8772068C4C198E14E7d7e5FD", // RinkArby 5
  ];

const tokenURIs = [
    "https://gateway.ipfs.io/ipfs/QmRqBdJwTGsvXxQMvBQsaxTr2MxRz9rxXREV4f3qgc74ve", //RinkArby 1
    "https://gateway.ipfs.io/ipfs/QmfSvxRS5BTLtgeYvPqiXx2huaRBuXd2nNN8gq5FTwmXp1", // RinkArby 2
    "https://gateway.ipfs.io/ipfs/QmTk5eZvUbd7fhJDmWbWa8KUMGhjSjxMkkVURYxw9JP9Bn", //RinkArby 3
    "https://gateway.ipfs.io/ipfs/QmcULSTu3wZUNURsdgAcTJSW4Lcrt4M58Py9GpM196U9gY", // RinkArby 4
    "https://gateway.ipfs.io/ipfs/QmRqBdJwTGsvXxQMvBQsaxTr2MxRz9rxXREV4f3qgc74ve", // RinkArby 5
  ];

  const contractAddress = "0xBC3a9c5DCF703C0F02013f8AEd59B5D75a57348A";
  
  async function main() {
    await arbLog('NFT Minting on Rinkarby');

    const contract = await hre.ethers.getContractAt("Warranties", contractAddress);

    const privKey = process.env.DEVNET_PRIVKEY;
    const apiKey = process.env.INFURA_API_KEY;

    provider = new ethers.providers.InfuraProvider("arbitrum-rinkeby", apiKey);

    let l2Wallet = new ethers.Wallet(privKey, provider);

    console.log('Your wallet address:', l2Wallet.address);

    const nonce = await l2Wallet.getTransactionCount();
    
    for(let i = 0; i < addresses.length; i++) {
      await contract.connect(l2Wallet).awardItem(addresses[i], tokenURIs[i],  {
        nonce: nonce + i
      });
    }
    console.log("Minting is complete!");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  