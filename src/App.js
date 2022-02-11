import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import Warranties from './artifacts/contracts/Warranties.sol/Warranties.json';
const abi = Warranties.abi;
const contractAddress = "0xBC3a9c5DCF703C0F02013f8AEd59B5D75a57348A";
const owner = "0x2d57e5e2bb5ea3bcd001668e3def98b6ee040e5e";

function App() {
  // setting state variables and respective setters.
  const [currentAccount, setCurrentAccount] = useState(null);
  const [senderAddress, setSenderAddress] = useState('');
  const [transferAddress, setTransferAddress] = useState('');

  let [arrayFlag, setArrayFlag] = useState(false);
  let [arrayOfIDs, setArrayOfIDs] = useState([]);

  const checkWalletIsConnected = async () => { 
    // checking metamask and if found auto connect to connected active account.
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
    // if no auto-login, show a connect wallet button to allow for connection to metamask.

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

  const retrieveNFTHandler = async () => {

    // retrieve the token IDs associated with the current account.
    let tempArray = [];
    setArrayFlag(false); // stop displaying array of tokenIDs on the page.

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

        if (tokenIDs.length > 0) {
          function convertAndAdd(value, index, array) {
            // if length not 0, push the tokenIDs from the tx data to the temporary array.  
            tempArray.push(Number(tokenIDs[index]["_hex"]));
          }

          // run convertAndAdd on each member of the tokenIDs array.
          tokenIDs.forEach(convertAndAdd);

          //update React state 'ArrayOfIDs' with contents of temporary array i.e. all tokenIDs associated with an account.
          setArrayOfIDs(tempArray);
          setArrayFlag(true); // allow display of ArrayOfIDs on page now.

        } else {
          alert("No NFTs found!");
          setArrayOfIDs([]);
        }

      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }

    // display flag for UI text 'No NFT's found' only to show up after user has pressed the retrieve button.
  };

  // onClick button functions.
  const mintNFTHandler = async () => {
    // handles the minting of NFTs.
    // ipfs json URLs for NFT info + image.
    const tokenURIs = [
      "https://gateway.ipfs.io/ipfs/QmRqBdJwTGsvXxQMvBQsaxTr2MxRz9rxXREV4f3qgc74ve", //RinkArby 1
      "https://gateway.ipfs.io/ipfs/QmfSvxRS5BTLtgeYvPqiXx2huaRBuXd2nNN8gq5FTwmXp1", // RinkArby 2
      "https://gateway.ipfs.io/ipfs/QmTk5eZvUbd7fhJDmWbWa8KUMGhjSjxMkkVURYxw9JP9Bn", //RinkArby 3
      "https://gateway.ipfs.io/ipfs/QmcULSTu3wZUNURsdgAcTJSW4Lcrt4M58Py9GpM196U9gY", // RinkArby 4
      "https://gateway.ipfs.io/ipfs/QmRqBdJwTGsvXxQMvBQsaxTr2MxRz9rxXREV4f3qgc74ve", // RinkArby 5
    ];

    // choose a random warranty to mint
    const tokenURI = tokenURIs[Math.floor(Math.random() * tokenURIs.length)]; 

    // check if current account connected in metamask is contract owner.
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
  
        // send mint transaction.
        let transaction = await contract.awardItem(senderAddress, tokenURI);
  
        // make sure to wait for transaction to go through.
        await transaction.wait();
        console.log(`Transaction hash: ${transaction.hash}`);
        
      } else {
        console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const transferNFTHandler = async () => {
    // handles the transfer of the specific token.

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

        // convert string prompt input to integer.
        const tokenInt = parseInt(tokenIDToTransfer);
        console.log("tokenInt: " + tokenInt);

        try {
          // send transfer transaction.
          let transaction = await contract.transferWarranty(transferAddress, tokenInt);
          await transaction.wait();
          console.log(`Transaction hash: ${transaction.hash}`);

          await retrieveNFTHandler();

          // removing token ID from list of tokenIDs associated to current account.

          let tempArray = [];
          for (let i = 0; i < arrayOfIDs.length; i++) {
            if(arrayOfIDs !== "") {
              tempArray.push(arrayOfIDs[i]);
            }
          };

          // set ArrayOfIDs to new token ID list without the one transferred and refresh display on page.
          setArrayFlag(false);
          setArrayOfIDs(tempArray); //
          setArrayFlag(true);

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
    // handles burning of the NFT after pressing burn.
    // only the owner of the contract can burn NFTs.
    if (currentAccount !== owner) {
      alert("You are not the contract owner, you do not have rights to burn NFTs");
      return;
    }
    // Confirmation message
    let promptText = "Are you sure you want to burn?";
    if (window.confirm(promptText) == true) {
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
            // send burn transaction.
            let transaction = await contract.burnWarranty(tokenInt);
            await transaction.wait();
          } catch (err) {
            alert("Burn not carried out! Are you sure the token ID is corrent?");
            console.log(err);
            return;
          }
        } else {
          console.log("Ethereum object does not exist. Are you sure Metamask is installed/functioning properly?");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const viewNFTHandler = async () => {
    // handles finding the image URL from the IPFS tokenURI JSON.
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

        // a function to download the JSON stored at the IPFS token URI and convert it into a JS object.
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
          // download token URI data.
          const res = await getObject(tokenURI);
          // retrieve NFT image URL and open in new tab.
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
  
  // JSX button functions.
  const connectWalletButton = () => { 
    return (
      <button onClick={connectWalletHandler} className= "cta-button connect-wallet-button">
        Connect Wallet
      </button>
    )
  };

  const mintNFTButton = () => { 
    return(
      <div>
        <h3> Contract Owner Special Functions: </h3>
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

  const burnNFTButton = () => {
    return(
      <div>
        <br></br>
        <button onClick={burnNFTHandler} className="cta-button burn-nft-button">
        Burn NFT 🔥
        </button>
      </div>
    )
  };

  const retrieveNFTButton = () => {
    return(
      <div>
        {/* <input
        className="input-address-box"
        type='text' 
        onChange={e => setretrieveAddress(e.target.value)} 
        placeholder="Address to check..." /> */}
        <button onClick={retrieveNFTHandler} className="cta-button token-id-button">
        Retrieve your NFTs 📨
        </button>
        <br></br>
      </div>
    )
  };

  const viewNFTButton = () => {
    return(
      <div>
        <br></br>
        <button onClick={viewNFTHandler} className="cta-button view-nft-button">
        View NFT 👀
        </button>
      </div>
    )
  }

  const transferNFTButton = () => {
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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    )
  };

  useEffect(() => {
    // run before App is loaded (something like that).
    checkWalletIsConnected();
  }, []);

  // page JSX.
  return (
    <div className='main-app'>
      <h1> NFT Warranties Prototype </h1>
        {
          currentAccount === owner ? 
          <h2> You are the contract owner! ✅ Welcome 🤩 </h2> 
          : ''
        }
      <div> 
        { currentAccount == owner ? mintNFTButton() : ''} 
        { currentAccount == owner ? burnNFTButton() : ''} 

        <br></br>
        <br></br>

        { arrayFlag && arrayOfIDs.length > 0 ? 
            <h3>Your NFT token ID(s): {arrayOfIDs.join(", ")}</h3> : 
            <div><h3> No NFTs found. </h3></div>
        }
    
        { currentAccount ? retrieveNFTButton() : connectWalletButton() }
        { currentAccount ? viewNFTButton() : '' }
        { currentAccount ? transferNFTButton() : '' }
        
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