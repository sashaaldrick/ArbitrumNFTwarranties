# Warranfties
------------------------------------------------------

* Digital product warranties already exist, but are easy to fake.
* How can we fix this?
* I built an immutable, verifiable and transferable warranty NFT system using Arbitrum for low fees, bringing the benefits of tokenisation to real-world products. ✅

Let's begin! Make sure you have git and npm installed. Clone the repo and cd into it, and install all required dependencies using npm.

```
git clone https://github.com/sashaaldrick/ArbitrumNFTwarranties
cd ArbitrumNFTwarranties
npm install
```

To deploy to a local blockchain (in this instance, hardhat's local chain), run the following commands:

```
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy_arbitrum.js --network rinkarby
```
Otherwise, to deploy to Rinkarby, make sure you place the required environment variables in .env:

DEVNET_PRIVKEY="your account on Rinkarby whom you want to deploy the contract from"
INFURA_API_KEY="infura Project ID" (to use Alchemy, change the provider to an [AlchemyProvider](https://docs.ethers.io/v5/api/providers/api-providers/#AlchemyProvider))

Be sure to fund your Rinkeby account first with ETH from somewhere like [here](https://faucets.chain.link/rinkeby).

Then bridge your tokens over to Arbitrum [here](https://bridge.arbitrum.io/).

And then run:

``` 
npx hardhat run scripts/deploy_arbitrum.js --network rinkarby
```

Then, to start the front-end website at [http://localhost:3000/](http://localhost:3000/), run:

```
cd src
npm start
```

And to run the tests on Warranties.sol, the main contract, run:

```
npx hardhat test
```

----------------------------------------------

## Thank you very much!! 💗

----------------------------------------------

### Some known bugs:

* The removal of NFT IDs associated to an address, stored on-chain in mapping 'NFTOwner' behaves incorrectly on NFT burn. It removes all token IDs associated with that address from the mapping 'NFTOwner'. To fix this, it might require an off-chain solution, as Solidity has limited array methods. Perhaps using OpenZeppellin's ERC721URIStorage method _getApprovedAddress_ would work somehow as a solution.
	* Furthermore, this would fix the issue that if you click "View NFTs" after "Burn NFTs", it can lead to the alert "No NFTs found", even if you have some!
* The code is quite hideous to read at the moment, a big refactoring is needed. This will be a good warmup for ETHDenver for me.


