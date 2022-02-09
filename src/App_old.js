import './App.css';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import Warranties from './artifacts/contracts/Warranties.sol/Warranties.json';

// Update with the contract address logged out to the CLI when it was deployed 
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [object, setObject] = useState({address: '', tokenID: 0, tokenURI: '', responseJSON: {}});
  const [flags, setFlags] = useState({address: false, tokenID: false, tokenURI: false, responseJSON: false, buttonClicked: false})

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchOwner(tokenID) {
    console.log('fetchOwner function called');
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Warranties.abi, provider);
    
      try {
        // const tokenID = object.tokenID;
        const data = await contract.viewOwner(tokenID);
        setObject({address: data});
      } catch (err) {
        console.log("Error: ", err);
      }
    }    
  }

  async function fetchURI(tokenID) {
    console.log('fetchURI function called');
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Warranties.abi, provider);
      try {
        // const tokenID = object.tokenID;
        const data = await contract.tokenURI(tokenID);
        setObject({tokenURI: data});
        setFlags({tokenURI: true});
      } catch (err) {
        console.log("Error: ", err);
      }
    }    
  }

  async function getObject(){
    return fetch(object.tokenURI)
    .then(response => response.json())
      .then(responseJSON => {
        setObject({responseJSON: responseJSON});
        setFlags({responseJSON: true});
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function getNFTInfo() {
    await fetchOwner(object.tokenID);
    await fetchURI(object.tokenID);
    await getObject();
    console.log(object.tokenURI);
    console.log(object.responseJSON);
    // let tokenID = object.tokenID;
    // fetchOwner(tokenID);
    // fetchURI(tokenID);
    // console.log(object);
    // console.log("NFT Owner: ", object.address);
    // console.log("Token ID: ", object.tokenID);
    // console.log("Token URI: ", object.tokenURI);
    // // getObject();
    setFlags({buttonClicked: true});
  }



  // // call the smart contract, send an update
  // async function setGreeting() {
  //   if (!greeting) return
  //   if (typeof window.ethereum !== 'undefined') {
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
  //     const transaction = await contract.setGreeting(greeting)
  //     await transaction.wait()
  //     fetchGreeting()
  //   }
  // }

  return (
    // <form>
    //   <h2> Fetch that NFT owner below...</h2>
    //   <input onChange={e => fetchOwner(e.target.value)} placeholder="Token ID to check..." /> 
    //   <h2> The address that owns this NFT is: {object.address}</h2>
    //   <input onChange={e => fetchURI(e.target.value)} placeholder="Token ID to check..." /> 
    //   <h2> The token URI is: {object.tokenURI}</h2>
    //   <input onChange={e => getObject(e.target.value)} placeholder="Download object..." /> 
    //   <h2> The response JSON is: {flags.responseJSON ? object.responseJSON.image : 'not loaded yet'} </h2>
    //   <img src={object.responseJSON.image} alt='' width="500" height="600"/> 
    // </form>
    <div>
      <h3> Input NFT token ID below: </h3>
      <input 
        type='text' 
        value={object.tokenID} 
        onChange={e => setObject({tokenID: e.target.value})} />
      <button onClick={getNFTInfo}> Get NFT Info </button>
      <br></br>
      The button has been <b>{flags.buttonClicked ? 'clicked.' : 'not clicked yet.'}</b>
      {flags.buttonClicked &&
      <div>
        <h2>
          The token ID you inputted is <b>{object.tokenID}</b>.
        </h2>
      </div>
      }
    </div>
  );
} // App closing bracket

export default App;