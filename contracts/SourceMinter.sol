// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "hardhat/console.sol";

contract SourceMinter {
    address immutable i_router;
    address immutable i_link;

    uint64 constant destinationChainSelector = 16015286601757825753; //Arbitrum Testnet
    address constant destinationChainContract =
        0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1;
    address constant receiverNFTContract =
        0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512; // nft receiver address
    string constant tokenURI =
        "https://ipfs.io/ipfs/QmaCuUhPUkEoennHXFwijiYRueD2DYiH6waZ7DqKR1MGcG";
    event MessageSent(bytes32 messageId);

    constructor(address router, address link) {
        i_router = router;
        i_link = link;
        LinkTokenInterface(i_link).approve(i_router, type(uint256).max);
    }

    receive() external payable {}

    function mint() external {
        console.log("Calling Mint Function");
        console.log("Creating EVM2 message");
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(destinationChainContract),
            data: abi.encodeWithSignature(
                "mint(address, tokenURI)",
                receiverNFTContract,
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
