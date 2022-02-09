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

    constructor() ERC721("Warranties", "WTY") {
        owner = msg.sender;
    }

    function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        require(msg.sender == owner, "You are required to be the owner of this contract to mint fresh warranties.");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function viewOwner(uint256 tokenId) public view returns(address) {
        return ownerOf(tokenId);
    }

    function transferWarranty(address to, uint256 tokenId) public {
        safeTransferFrom(msg.sender, to, tokenId);
    }

    function burnWarranty(uint256 tokenId) public {
        require(msg.sender == owner);
        _burn(tokenId);
    }
}