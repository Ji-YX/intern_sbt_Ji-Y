pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SharedNFT is ERC721 {
    uint256 public totalCopies;
    mapping(address => bool) public hasCopies;

    constructor(string memory _name, string memory _symbol, uint256 _totalCopies) ERC721(_name, _symbol) {
        totalCopies = _totalCopies;
    }

    function splitNFT() public {
        require(!hasCopies[msg.sender], "You already have a copy of this NFT");
        require(totalCopies > 0, "No more copies left to split");

        totalCopies -= 1;
        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);
        hasCopies[msg.sender] = true;
    }
}
