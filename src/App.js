import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// import ABI
import Warranties from './artifacts/contracts/Warranties.sol/Warranties.json';
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = Warranties.abi;
const owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [senderAddress, setSenderAddress] = useState('');
  
  const checkWalletIsConnected = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    }
    else {
      console.log("Wallet exists! You are ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorised account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorised account found");
    }
  }

  const connectWalletHandler = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!")
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch(err) {
      console.log(err);
    }
  }

  const mintNFTHandler = async () => {
    console.log("Sender Address received: ", senderAddress);
    const tokenURI = "https://gateway.ipfs.io/ipfs/QmT46iidWfVqM2wrUoqWQ3Kefv7Cz4S8jxim8TfdW3chqS"

    if (currentAccount !== owner) {
      alert("You have to be the owner of this contract to mint NFTs!");
      return;
    }

    try {
      const { ethereum } = window;

      if(ethereum) {
        // get connection to the blockchain with a provider.
        const provider = new ethers.providers.Web3Provider(ethereum);
  
        // get the connected account as a signer for transaction signing.
        const signer = provider.getSigner();
  
        // instantiates a on chain contract as a JavaScript object connected to the signer
        // and subsequently the provider as well.
        const contract = new ethers.Contract(contractAddress, abi, signer);
  
        // send transaction.
        let transaction = await contract.awardItem(senderAddress, tokenURI);
  
        // make sure to wait for transaction to go through.
        // await provider.waitForTransaction(transaction);
        await transaction.wait();
        console.log(`Transaction hash: ${transaction.hash}`);

      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
   };
  
  const connectWalletButton = () => { 
    return (
      <button onClick={connectWalletHandler} className= "cta-button connect-wallet-button">
        Connect Wallet
      </button>
    )
  };

  const mintNFTButton = () => { 
    return(
      <button onClick={mintNFTHandler} className="cta-button mint-nft-button">
        Mint NFT
      </button>
    )
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className='main-app'>
      <h1> CeramicSpeed NFT Warranties </h1>
      <div> 
        {
          currentAccount ? 
            <div>
            <h3> Please input address: </h3>
            <input
            className="input-address-box"
            type='text' 
            value={senderAddress} 
            onChange={e => setSenderAddress(e.target.value)} 
            placeholder="NFT receiver address..." />
            </div>
          : ''
        } 
      </div>
      <div>
        {currentAccount ? mintNFTButton() : connectWalletButton()}
      </div>
      <div>
        {
          currentAccount ? 
            <div>
            <h3> Your connected address is: {currentAccount} </h3>
            </div>
          : ''
        } 
        {
          <h3> The contract address is: {contractAddress}</h3>
        }
      </div>

    </div>
  )
};; 

export default App;