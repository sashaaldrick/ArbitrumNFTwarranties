import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import Warranties from './artifacts/contracts/Warranties.sol/Warranties.json';
const contractAddress = "0xBC3a9c5DCF703C0F02013f8AEd59B5D75a57348A";
const abi = Warranties.abi;
const owner = "0x2d57e5e2bb5ea3bcd001668e3def98b6ee040e5e";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [senderAddress, setSenderAddress] = useState('');
  const [transferAddress, setTransferAddress] = useState('');

  let [arrayOfIDs, setArrayOfIDs] = useState([]);
  let [arrayFlag, setArrayFlag] = useState(false);
 
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

  const retrieveTokenIDs = async () => {
    let tempArray = [];

    setArrayFlag(false);

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

        // retrieve NFT owner address.
        const tokenIDs = await contract.getTokenIDs(currentAccount);
        console.log("Token IDs returned: ", tokenIDs);

        if (tokenIDs.length > 0) {
          function convertAndAdd(value, index, array) {
            tempArray.push(Number(tokenIDs[index]["_hex"]));
          }

          tokenIDs.forEach(convertAndAdd);
          setArrayOfIDs(tempArray);
          setArrayFlag(true);
        } else {
          alert("No NFTs found!");
          return;
        }

      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mintNFTHandler = async () => {
    console.log("Sender Address received: ", senderAddress);

    const tokenURIs = [
      "https://gateway.ipfs.io/ipfs/QmRqBdJwTGsvXxQMvBQsaxTr2MxRz9rxXREV4f3qgc74ve", //RinkArby 1
      "https://gateway.ipfs.io/ipfs/QmfSvxRS5BTLtgeYvPqiXx2huaRBuXd2nNN8gq5FTwmXp1", // RinkArby 2
      "https://gateway.ipfs.io/ipfs/QmTk5eZvUbd7fhJDmWbWa8KUMGhjSjxMkkVURYxw9JP9Bn", //RinkArby 3
      "https://gateway.ipfs.io/ipfs/QmcULSTu3wZUNURsdgAcTJSW4Lcrt4M58Py9GpM196U9gY", // RinkArby 4
      "https://gateway.ipfs.io/ipfs/QmRqBdJwTGsvXxQMvBQsaxTr2MxRz9rxXREV4f3qgc74ve", // RinkArby 5
    ];

    const tokenURI = tokenURIs[Math.floor(Math.random() * tokenURIs.length)];

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
        
        // const receipt = await provider.getTransactionReceipt(transaction.hash);
        // const logs = receipt.logs;
        // const tokenID = ethers.BigNumber.from(logs[0]["topics"][3]).toNumber();
        // console.log(tokenID);

      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
   };

  const transferNFTHandler = async () => {
    console.log("Transfer Address received: ", transferAddress);
    
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

        // retrieve list of NFTs for current connected account.
        const NFTs = await contract.getTokenIDs(currentAccount);
        console.log("NFTs associated with current account: " + NFTs);

        const tokenIDToTransfer = prompt("Enter the token ID of the NFT you want to transfer");

        const tokenInt = parseInt(tokenIDToTransfer);
        console.log("tokenInt: " + tokenInt);
        try {
          let transaction = await contract.transferWarranty(transferAddress, tokenInt);
          await transaction.wait();
          console.log(`Transaction hash: ${transaction.hash}`);
          setArrayOfIDs([]);
          setArrayFlag(false);
        } catch (err) {
          alert("Are you sure you own this NFT!")
          return;
        }
      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const burnNFTHandler = async () => {
    if (currentAccount !== owner) {
      alert("You are not the contract owner, you do not have rights to burn NFTs");
      return;
    }
    alert("Are you sure you want to burn?");
    
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

        // retrieve list of NFTs for current connected account.

        const tokenIDToBurn = prompt("Which token ID to burn?");
        const tokenInt = parseInt(tokenIDToBurn);

        try {
          let transaction = await contract.burnWarranty(tokenInt);
          await transaction.wait();
          console.log(`Transaction hash: ${transaction.hash}`);
          console.log("Array of IDs: " + arrayOfIDs);
          var filteredArray = arrayOfIDs.filter(e => e !== tokenInt);
          console.log(filteredArray);
        } catch (err) {
          alert("Burn not carried out!")
          console.log(err);
          return;
        }
      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const viewNFTHandler = async () => {
    
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

        // retrieve list of NFTs for current connected account.

        const tokenIDToView = prompt("Which token ID to view?");
        const tokenInt = parseInt(tokenIDToView);


        async function getObject(tokenURI){
          return fetch(tokenURI)
          .then(response => response.json())
            .then(responseJSON => {
              return responseJSON;
            })
            .catch(error => {
              console.error(error);
            });
        }
      

        try {
          const tokenURI = await contract.tokenURI(tokenInt);
          console.log("tokenURI received: " + tokenURI);
          const res = await getObject(tokenURI);
          const imageURL = res.image;
          window.open(imageURL, '_blank');
        } catch (err) {
          alert("Can't view NFT, are you sure you typed the right token ID?")
          console.log(err);
          return;
        }

      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const connectWallet = () => { 
    return (
      <button onClick={connectWalletHandler} className= "cta-button connect-wallet-button">
        Connect Wallet
      </button>
    )
  };

  const mintNFT = () => { 
    return(
      <div>
        <input
        className="input-address-box"
        type='text' 
        value={senderAddress} 
        onChange={e => setSenderAddress(e.target.value)} 
        placeholder="Address to mint to..." />
        <br></br>
        <button onClick={mintNFTHandler} className="cta-button mint-nft-button">
          Mint NFT 📝
        </button>
      </div>
    )
  };

  const transferNFT = () => {
    return(
      <div>
        <br></br>
        <input
        className="input-address-box"
        type='text' 
        value={transferAddress} 
        onChange={e => setTransferAddress(e.target.value)} 
        placeholder="Address to transfer to..." />
        <br></br>
        <button onClick={transferNFTHandler} className="cta-button transfer-nft-button">
          Transfer NFT 📭
        </button>
      </div>
    )
  };

  const retrieveNFT = () => {
    return(
      <div>
        <br></br>
        {/* <input
        className="input-address-box"
        type='text' 
        onChange={e => setretrieveAddress(e.target.value)} 
        placeholder="Address to check..." /> */}
        <button onClick={retrieveTokenIDs} className="cta-button token-id-button">
        Retrieve your NFTs 📨
        </button>
      </div>
    )
  };

  const burnNFT = () => {
    return(
      <div>
        <br></br>
        <button onClick={burnNFTHandler} className="cta-button burn-nft-button">
        Burn NFT 🔥
        </button>
      </div>
    )
  };

  const viewNFT = () => {
    return(
      <div>
        <br></br>
        <button onClick={viewNFTHandler} className="cta-button view-nft-button">
        View NFT 👀
        </button>
      </div>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className='main-app'>
      <h1> NFT Warranties Prototype </h1>
        {
          currentAccount === owner ? 
          <h3> You are the contract owner! ✅ Welcome 🤩 </h3> 
          : ''
        }
      <div> 
        { currentAccount == owner ? mintNFT() : ''} 
        { currentAccount == owner ? burnNFT() : ''} 

        { currentAccount ? retrieveNFT() : connectWallet() }
        { arrayFlag ? <h3>Your NFT Serial Numbers: {arrayOfIDs.join(", ")}</h3> : ''}

        { currentAccount ? viewNFT() : '' }
        { currentAccount ? transferNFT() : '' }
        
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
          <h3> The Arbitrum contract address is: {contractAddress}</h3>
        }
      </div>
    </div>
  )
};; 

export default App;