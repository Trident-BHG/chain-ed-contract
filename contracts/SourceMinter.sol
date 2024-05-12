// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "hardhat/console.sol";

contract SourceMinter {
    address immutable i_router;
    address immutable i_link;
    event MessageSent(bytes32 messageId);

    constructor(address router, address link) {
        i_router = router;
        i_link = link;
        LinkTokenInterface(i_link).approve(i_router, type(uint256).max);
    }

    receive() external payable {}

    function mint(
        uint64 destinationChainSelector,
        address destinationChainContract,
        address receiverStudentAddress,
        string memory tokenURI
    ) external {
        console.log("Calling Mint Function");
        console.log("Creating EVM2 message");
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(destinationChainContract),
            data: abi.encodeWithSignature(
                "mint(address,string)",
                receiverStudentAddress,
                tokenURI
            ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        console.log("EVM2 message creation finished");

        console.log("Trying to get fee for ccip...");

        console.log(
            IRouterClient(i_router).getFee(destinationChainSelector, message)
        );

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        console.log("Got the fee for ccip:");

        bytes32 messageId;

        console.log("Get message id...");

        messageId = IRouterClient(i_router).ccipSend{value: fee}(
            destinationChainSelector,
            message
        );

        console.log("Got message Id");

        emit MessageSent(messageId);
    }
}