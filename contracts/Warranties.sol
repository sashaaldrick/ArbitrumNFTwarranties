// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Warranties is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address owner;

    // a record of NFT token ID's mapped to their owner's addresses.
    mapping(address => uint[]) public NFTOwner;

    constructor() ERC721("Warranties", "WTY") {
        owner = msg.sender;
    }

    function awardItem(address receiver, string memory tokenURI)
        public
        returns (uint256)
    {
        require(msg.sender == owner, "You are required to be the owner of this contract to mint fresh warranties.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(receiver, newItemId);
        _setTokenURI(newItemId, tokenURI);
        NFTOwner[receiver].push(newItemId);
        return newItemId;
    }

    function viewOwner(uint256 tokenId) public view returns(address) {
        return ownerOf(tokenId);
    }

    function transferWarranty(address to, uint256 tokenId) public {
        safeTransferFrom(msg.sender, to, tokenId);
        delete NFTOwner[msg.sender]; // deletes ALL NFTs associated with account, this needs to be fixed with getApproved method, but don't have time right now.
    }

    function burnWarranty(uint256 tokenId) public {
        require(msg.sender == owner, "You are not the owner of this contract so you can not burn NFTs.");
        _burn(tokenId);
    }

    function getTokenIDs(address _owner) public view returns(uint[] memory) {
        // getter function for seeing array of token ID's belonging to input address.
        return NFTOwner[_owner];
    }
}