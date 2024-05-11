// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Certificate is ERC721URIStorage, Ownable {
    uint256 internal tokenId;

    //collection name, symbol
    constructor() ERC721("Certificate", "CERT") {}

    //ipfs://QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG
    //onlyOwner
    function mint(address to, string memory tokenURI) public onlyOwner {
        console.log("Reached mint function in Certificate contract");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        unchecked {
            tokenId++;
        }
    }
}
