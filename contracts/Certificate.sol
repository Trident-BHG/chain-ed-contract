// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "hardhat/console.sol";

error Certificate__NotDestinationMinter();

contract Certificate is
    ERC721URIStorage,
    VRFV2PlusWrapperConsumerBase,
    Ownable
{
    event RequestSent(uint256 requestId, uint32 numWords);

    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }

    struct CertificateRequest {
        address studentAddress;
        string tokenURI;
    }

    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    mapping(uint256 => CertificateRequest)
        public s_certificateRequests; /* requestId --> certificateRequest */

    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 constant numWords = 1;
    address immutable i_wrapperAddress;
    address immutable i_linkAddress;
    address destinationMinterAddress;

    uint256 internal tokenId;
    uint256 maxSupplyOfToken = 3000;

    //collection name, symbol
    constructor(
        address _linkAddress,
        address _wrapperAddress
    )
        ERC721("Certificate", "CERT")
        VRFV2PlusWrapperConsumerBase(_wrapperAddress)
    {
        i_linkAddress = _linkAddress;
        i_wrapperAddress = _wrapperAddress;
    }

    function requestRandomWords() internal returns (uint256) {
        // choosing payments in LINK
        bytes memory extraArgs = VRFV2PlusClient._argsToBytes(
            VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
        );

        (uint256 requestId, uint256 requestPrice) = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords,
            extraArgs
        );

        s_requests[requestId] = RequestStatus({
            paid: requestPrice,
            randomWords: new uint256[](0),
            fulfilled: false
        });
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
        tokenId = s_requests[_requestId].randomWords[0];
        tokenId = getValidAvailableTokenId(tokenId);
        address to = s_certificateRequests[_requestId].studentAddress;
        string memory tokenURI = s_certificateRequests[_requestId].tokenURI;
        // mint certificate NFT to student address
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function getValidAvailableTokenId(
        uint256 randomTokenId
    ) internal returns (uint256) {
        randomTokenId = randomTokenId % maxSupplyOfToken;
        randomTokenId = checkIfTokenIdAlreadyExists(randomTokenId);
        if (randomTokenId == maxSupplyOfToken) {
            //increase max token supply
            maxSupplyOfToken = maxSupplyOfToken + 1000;
            // again look for valid token Id by mod of original long token Id
            return getValidAvailableTokenId(tokenId);
        }
        return randomTokenId;
    }

    // check if token id already exists and return an available token id
    function checkIfTokenIdAlreadyExists(
        uint256 shortTokenId
    ) internal view returns (uint256) {
        uint256 start = shortTokenId;
        if (_exists(shortTokenId)) {
            while (_exists(shortTokenId) && shortTokenId < maxSupplyOfToken) {
                shortTokenId = shortTokenId + 1;
            }
            if (shortTokenId == maxSupplyOfToken) {
                shortTokenId = 0;
            } else {
                return shortTokenId;
            }
            while (_exists(shortTokenId) && shortTokenId < start) {
                shortTokenId = shortTokenId + 1;
            }
            if (shortTokenId == start) {
                console.log(
                    "All available token Ids have been used. Need to increase max supply of token Ids"
                );
                return maxSupplyOfToken;
            } else {
                return shortTokenId;
            }
        }
        return shortTokenId;
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    function mint(
        address to,
        string memory _tokenURI
    ) public onlyDestinationMinter {
        console.log("Reached mint function in Certificate contract");
        uint256 requestId = requestRandomWords();
        console.log("Got the VRF Request Id");
        s_certificateRequests[requestId] = CertificateRequest({
            studentAddress: to,
            tokenURI: _tokenURI
        });
        console.log("Waiting for random number to be returned.");
    }

    modifier onlyDestinationMinter() {
        if (msg.sender != destinationMinterAddress) {
            revert Certificate__NotDestinationMinter();
        }
        _;
    }

    function setDestinationMinterAddress(
        address _destinationMinterAddress
    ) external onlyOwner {
        destinationMinterAddress = _destinationMinterAddress;
    }

    function withdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(i_linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function getCallbackGasLimit() public view returns (uint32) {
        return callbackGasLimit;
    }

    function setCallbackGasLimit(uint32 _gasLimit) external onlyOwner {
        callbackGasLimit = _gasLimit;
    }

    function getRequestConfirmations() public view returns (uint16) {
        return requestConfirmations;
    }

    function setRequestConfirmations(
        uint16 _requestConfirmations
    ) external onlyOwner {
        requestConfirmations = _requestConfirmations;
    }

    function getWrapperAddress() public view returns (address) {
        return i_wrapperAddress;
    }

    function getLinkAddress() public view returns (address) {
        return i_linkAddress;
    }
}
