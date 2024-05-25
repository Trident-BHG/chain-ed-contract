// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract DestinationPayment is CCIPReceiver, Ownable {
    event PaymentCallSuccessful();

    address paymentContractAddress;
    Payment paymentContract;

    constructor(address _router) CCIPReceiver(_router) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(paymentContract).call(message.data);
        require(success);
        emit PaymentCallSuccessful();
    }

    function getPaymentContractAddress() public view returns (address) {
        return nftAddress;
    }

    function getPaymentContractAddress(
        address _paymentContractAddress
    ) external onlyOwner {
        paymentContractAddress = _paymentContractAddress;
        paymentContract = Payment(paymentContractAddress);
    }
}
