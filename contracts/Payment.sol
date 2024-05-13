// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Payment {
    address public owner;

    // user wallet addres => courseId => payment made towards it.
    mapping(address => mapping(uint256 => uint256)) public userCoursePaymentMap;
    // user wallet addres => courseId => claim eligible.
    mapping(address => mapping(uint256 => uint256)) public claimPaymentMap;

    constructor() {
        owner = msg.sender;
    }

    event CourseBought(
        address user,
        uint256 courseId,
        address tokenAddress,
        uint256 amountPaid
    );
    event ClaimAmountUpdate(address user, uint256 courseId, uint256 amount);
    event AmountClaimed(
        address user,
        uint256 courseId,
        address tokenAddress,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this function");
        _;
    }

    modifier totalClaimLessThatPrice(
        address user,
        uint256 courseId,
        uint256 unlockClaimAmount
    ) {
        require(
            claimPaymentMap[user][courseId] + unlockClaimAmount <=
                userCoursePaymentMap[user][courseId],
            "claim amount should be less than course fee paid"
        );
        _;
    }

    modifier claimAmountIsNotZero(
        address user,
        uint256 courseId,
        uint256 claimAmount
    ) {
        require(claimAmount != 0, "claim amount cannot be zero");
        require(
            claimPaymentMap[user][courseId] != 0,
            "not eligible to get a claim for this course"
        );
        require(
            claimPaymentMap[user][courseId] >= claimAmount,
            "user not eligible to claim this amount"
        );
        _;
    }

    function buyCourse(
        address user,
        uint256 courseId,
        uint256 amountPaid,
        address tokenAddress
    ) external {
        IERC20 tokenERC20Contract = IERC20(tokenAddress);
        // get approval from user to use their tokens, before making calls here
        // transfer tokens to yourself.
        bool sent = tokenERC20Contract.transferFrom(
            user,
            address(this),
            amountPaid
        );
        require(sent, "tokens not transferred");

        // update the mapping
        userCoursePaymentMap[user][courseId] = amountPaid;
        emit CourseBought(user, courseId, tokenAddress, amountPaid);
    }

    function claimPayment(
        address user,
        uint256 courseId,
        address tokenAddress,
        uint256 claimAmount
    ) external onlyOwner claimAmountIsNotZero(user, courseId, claimAmount) {
        claimPaymentMap[user][courseId] =
            claimPaymentMap[user][courseId] -
            claimAmount;

        IERC20 erc20TokenContract = IERC20(tokenAddress);
        bool sent = erc20TokenContract.transfer(user, claimAmount);
        require(sent, "tokens not sent to user");
        emit AmountClaimed(user, courseId, tokenAddress, claimAmount);
    }

    function updateClaims(
        address user,
        uint256 courseId,
        uint256 unlockClaimAmount
    )
        external
        onlyOwner
        totalClaimLessThatPrice(user, courseId, unlockClaimAmount)
    {
        claimPaymentMap[user][courseId] =
            claimPaymentMap[user][courseId] +
            unlockClaimAmount;
        emit ClaimAmountUpdate(user, courseId, unlockClaimAmount);
    }

    function getCourseAmountPaidByUser(
        address user,
        uint256 courseId
    ) external view returns (uint256) {
        return userCoursePaymentMap[user][courseId];
    }

    function getAmountClaimableByUser(
        address user,
        uint256 courseId
    ) external view returns (uint256) {
        return claimPaymentMap[user][courseId];
    }
}
