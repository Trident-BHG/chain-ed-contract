// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract SourcePayment is Ownable {
    using SafeERC20 for IERC20;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);

    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        string buyCourseFunc,
        address paymentToken,
        uint256 courserPrice,
        address feeToken,
        uint256 fees,
        address user,
        uint256 courseId
    );
    address immutable i_router;
    IERC20 private s_linkToken;
    uint256 public ccipGasLimit = 400000;

    constructor(address router, address link) {
        i_router = router;
        s_linkToken = IERC20(link);
    }

    function buyCourse(
        uint64 _destinationChainSelector,
        address _receiver,
        address _paymentToken,
        uint256 _coursePrice,
        address _user,
        uint256 _courseId
    ) external onlyOwner returns (bytes32 messageId) {
        string
            memory buyCourseFunc = "buyCourse(address,uint256,uint256,address)";
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            buyCourseFunc,
            _paymentToken,
            _coursePrice,
            address(s_linkToken),
            _user,
            _courseId
        );

        IRouterClient router = IRouterClient(i_router);
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
        if (fees > s_linkToken.balanceOf(address(this))) {
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        }
        s_linkToken.approve(address(router), fees);
        IERC20(_paymentToken).approve(address(router), _coursePrice);
        messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        emit MessageSent(
            messageId,
            _destinationChainSelector,
            _receiver,
            buyCourseFunc,
            _paymentToken,
            _coursePrice,
            address(s_linkToken),
            fees,
            _user,
            _courseId
        );
        return messageId;
    }

    function _buildCCIPMessage(
        address _receiver,
        string memory _buyCourseFunc,
        address _paymentToken,
        uint256 _coursePrice,
        address _feeTokenAddress,
        address _user,
        uint256 _courseId
    ) private view returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: _paymentToken,
            amount: _coursePrice
        });
        tokenAmounts[0] = tokenAmount;
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encodeWithSignature(
                _buyCourseFunc,
                _user,
                _courseId,
                _coursePrice,
                _paymentToken
            ),
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: ccipGasLimit})
            ),
            feeToken: _feeTokenAddress
        });
        return evm2AnyMessage;
    }

    // function sendMessagePayNative(
    //     uint64 _destinationChainSelector,
    //     address _receiver,
    //     string calldata _text,
    //     address _token,
    //     uint256 _amount
    // ) external onlyOwner returns (bytes32 messageId) {
    //     Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
    //         _receiver,
    //         "BuyCourse",
    //         _token,
    //         _amount,
    //         address(0)
    //     );

    //     IRouterClient router = IRouterClient(i_router);
    //     uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
    //     if (fees > address(this).balance) {
    //         revert NotEnoughBalance(address(this).balance, fees);
    //     }
    //     IERC20(_token).approve(address(router), _amount);
    //     messageId = router.ccipSend{value: fees}(
    //         _destinationChainSelector,
    //         evm2AnyMessage
    //     );

    //     emit MessageSent(
    //         messageId,
    //         _destinationChainSelector,
    //         _receiver,
    //         _text,
    //         _token,
    //         _amount,
    //         address(0),
    //         fees
    //     );
    //     return messageId;
    // }

    receive() external payable {}

    function getCcipGasLimit() public view returns (uint256) {
        return ccipGasLimit;
    }

    function setCcipGasLimit(uint256 gasLimit) public onlyOwner {
        ccipGasLimit = gasLimit;
    }

    function getRouter() public view returns (address) {
        return i_router;
    }

    function withdrawEther() external onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}
