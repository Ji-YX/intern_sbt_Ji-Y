// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

//ミントした人によって、識別されるような NFTを作って、
contract SharedNFT is ERC721A, Ownable, AccessControl {

    //SUPPORTSINTERFACE IS defined in both ERC721A and AccessControl
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //new
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //end of new



    // Max batch size for minting one time
    uint256 private _maxBatchSize;


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    //new
    struct TokenData {
        address owner;
        address mintedBy;
    }

    mapping(uint256 => TokenData) private mintedTokens;
    //end of new


    // Mapping from token Id to hashed credential ID
    mapping(uint256 => string) private _ownedCredential;

    // Mapping from hashed credential Id to owner possession flag
    mapping(string => mapping(address => bool)) private _credentialOwnerships;


    constructor(
      string memory _name,
      string memory _symbol,
      uint256 _newMaxBatchSize
      ) ERC721A(_name, _symbol) {
        _maxBatchSize = _newMaxBatchSize;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    
    //Grant only those who have more than 1 NFT can be MINTER_ROLE
    function grantMinterRole(
      address _toAddress
    ) public {
        uint256 balance = balanceOf(_toAddress);
        require(balance >= 1, "Only accounts with at least one NFT can be granted MINTER_ROLE");
        grantRole(MINTER_ROLE, _toAddress);
    }

    // function grantMinterRole_old() public {
    //     uint256 balance = balanceOf(msg.sender);
    //     require(balance >= 1, "Only accounts with at least one NFT can be granted MINTER_ROLE");
    //     grantRole(MINTER_ROLE, msg.sender);
    // }

    /*
    function mint(address to, address from) public onlyRole(MINTER_ROLE) {
        require(from == owner(), "Only the NFT owner can mint new NFTs");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
    }
    */

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a MINTER");
        _;
    }

    function hasMinterRole(
        address addr
    ) public view returns(bool) {
        return hasRole(MINTER_ROLE, addr);
    }

    function mintAndTransfer(
        string memory _credentialId,
        string memory _description,
        address[] memory _toAddresses,
        string[] memory _imageURIs,
        string[] memory _externalURIs
    ) public onlyMinter {
        uint256 requestNum = _toAddresses.length;
        require(requestNum > 0, "The _toAddresses is empty.");
        require(
            requestNum <= getMaxBatchSize(),
            "The length of _toAddresses must be less than or equal to _maxBatchSize."
        );
        require(
            requestNum == _imageURIs.length,
            "The length of _toAddresses and _imageURIs are NOT same."
        );
        require(
            requestNum == _externalURIs.length,
            "The length of _toAddresses and _externalURIs are NOT same."
        );
        for (uint i = 0; i < _toAddresses.length; i++){
            require(
                0 == balanceOf(_toAddresses[i]),
                "The balanceOf some addresses is NOT zero."
            // できれば、何番目のアドレスが NFTを１枚以上保有しているのか、失敗したかも表示したい。
            );
        }
        for (uint i = 0; i < requestNum; i++) {
            address _to = _toAddresses[i];
            bool hasCredential = _credentialOwnerships[_credentialId][_to];
            require(
                !hasCredential,
                "One or more recipient has had already the same credential."
            );
            require(_to != owner(), "_toAddresses must NOT be included OWNER.");
        }

        // put the next token ID down in the variable before the bulk mint
        uint256 startTokenId = _nextTokenId();
        _safeMint(owner(), requestNum);

        // do bulk transfer to each specified address only for the minted tokens
        uint256 tokenId = startTokenId;
        for (uint i = 0; i < requestNum; i++) {
            // update the credential ID mapping
            _ownedCredential[tokenId] = _credentialId;

            //NEW
            mintedTokens[tokenId] = TokenData({
                owner: _toAddresses[i],
                mintedBy : msg.sender
            });
            // transfer to the specified address
            safeTransferFrom(owner(), _toAddresses[i], tokenId);

            // Grant the MinterRole to the address minting to.
            grantMinterRole(_toAddresses[i]);
            // update the token URI
            _setTokenURI(
                tokenId,
                generateTokenURI(_description, _imageURIs[i], _externalURIs[i])
            );
            tokenId += 1;
        }
    }

    //from https://github.com/takagi-sh/intern_sbt/blob/main/subfolder_tmp/contracts/NFTCredential.sol#L150
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyOwner {
        address _tokenOwner = ownerOf(tokenId);
        require(
            from == _tokenOwner,
            "The from-address is NOT the token ID's owner."
        );

        // Banned for transfering to OWNER,
        // because to make sure that the status of credential ID mappings will not be complicated.
        require(to != owner(), "The to-address must NOT be OWNER.");

        string memory _credentialId = ownedCredential(tokenId);
        bool _hasToAddr = _credentialOwnerships[_credentialId][to];
        require(!_hasToAddr, "The to-address has the same credential already.");

        super.transferFrom(from, to, tokenId);
        // update the credential ID mappings
        _credentialOwnerships[_credentialId][from] = false;
        _credentialOwnerships[_credentialId][to] = true;
    }

    function updateNFT(
        uint256 tokenId,
        string memory _credentialId,
        string memory _description,
        string memory _imageURI,
        string memory _externalURI
    ) public onlyOwner {
        // update the credential ID mappings
        string memory _currentCredentialId = ownedCredential(tokenId);
        bytes32 _currentHash = keccak256(bytes(_currentCredentialId));
        bytes32 _newHash = keccak256(bytes(_credentialId));
        if (_currentHash != _newHash) {
            _ownedCredential[tokenId] = _credentialId;
            address _tokenOwner = ownerOf(tokenId);
            _credentialOwnerships[_currentCredentialId][_tokenOwner] = false;
            _credentialOwnerships[_credentialId][_tokenOwner] = true;
        }
        // update the tokenURI
        _setTokenURI(tokenId, generateTokenURI(_description, _imageURI, _externalURI));
    }

    function getMaxBatchSize() public view onlyOwner returns (uint256) {
        return _maxBatchSize;
    }

    function setMaxBatchSize(uint256 _newMaxBatchSize) public onlyOwner {
        _maxBatchSize = _newMaxBatchSize;
    }

    function ownedCredential(uint256 tokenId)
        public
        view
        onlyOwner
        returns (string memory)
    {
        require(_exists(tokenId), "The token ID does NOT exist.");
        return _ownedCredential[tokenId];
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        // Banned for transfering ownership to a user who has this token already,
        // because to make sure that the status of credential ID mappings will not be complicated.
        require(balanceOf(newOwner) == 0, "newOwner's balance must be zero.");
        super.transferOwnership(newOwner);
    }

    function myBalanceOf(address Owner) public view returns (uint256) {
        return balanceOf(Owner);
    }

    // function getMintedBy(uint256 _tokenId) 
    //     public 
    //     view 
    //     returns (address) 
    // {
    //     require(_exists(_tokenId), "Token does not exist.");
    //     return _tokenMinters[_tokenId];
    // }

    function getMintedBy(uint256 _tokenId) public view returns (address) {
        require(_exists(_tokenId), "Token does not exist");
        TokenData memory tokenData = mintedTokens[_tokenId];
        return tokenData.mintedBy;
    }

    // To be soulbound NFT except owner operations.
    function _beforeTokenTransfers(
        address,
        address,
        uint256,
        uint256
    ) internal view override onlyOwner {}

    function generateTokenURI(
        string memory _description,
        string memory _imageURI,
        string memory _externalURI
    ) internal view returns (string memory) {
        bytes memory _attributes = abi.encodePacked('"attributes": []');
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                name(),
                '",'
                '"description": "',
                _description,
                '",'
                '"image": "',
                _imageURI,
                '",',
                '"external_url": "',
                _externalURI,
                '",',
                string(_attributes),
                "}"
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // =============================================================
    //   The followings are copied from ERC721URIStorage.sol
    // =============================================================

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId));
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
}
