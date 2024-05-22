// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Certificate} from "./Certificate.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract DestinationMinter is CCIPReceiver, Ownable {
    event MintCallSuccessfull();
    Certificate certNFT;
    address nftAddress;

    constructor(address router) CCIPReceiver(router) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        console.log("Reached __ccipReceive");
        (bool success, ) = address(certNFT).call(message.data);
        require(success);
        emit MintCallSuccessfull();
    }

    function getNFTAddress() public view returns (address) {
        return nftAddress;
    }

    function setNFTAddress(address _nftAddress) external onlyOwner {
        nftAddress = _nftAddress;
        certNFT = Certificate(nftAddress);
    }
}
