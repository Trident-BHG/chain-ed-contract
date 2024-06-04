// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract StakingTokens {
    address owner;
    IPoolAddressesProvider private poolAddressProvider =
        IPoolAddressesProvider(0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e);
    address POOL_ADDRESS = poolAddressProvider.getPool();
    IPool private pool = IPool(POOL_ADDRESS);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "only owner can call this function");
        _;
    }

    event TokensSupplied(address asset, uint256 amount);
    event TokensWithdrawn(address asset, uint256 amount);

    function supplyTokens(address asset, uint256 amount) external onlyOwner {
        IERC20 erc20Contract = IERC20(asset);
        bool approved = erc20Contract.approve(POOL_ADDRESS, amount);
        require(approved, "token spending not approved");
        pool.supply(asset, amount, address(this), 0);

        emit TokensSupplied(asset, amount);
    }

    function withdrawTokens(address asset, uint256 amount) external onlyOwner {
        pool.withdraw(asset, amount, address(this));
        emit TokensWithdrawn(asset, amount);
    }
}
