// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftCollection is ERC721, ERC721Burnable, Ownable {
    uint256 public immutable maxSupply;
    uint256 private _totalSupply;
    string private _baseTokenURI;
    bool public mintingPaused;

    // Track minted tokenIds explicitly
    mapping(uint256 => bool) private _minted;

    event MintingPausedChanged(bool paused);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        string memory baseURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        require(maxSupply_ > 0, "maxSupply>0");
        maxSupply = maxSupply_;
        _baseTokenURI = baseURI_;
        mintingPaused = false;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function pauseMinting() external onlyOwner {
        mintingPaused = true;
        emit MintingPausedChanged(true);
    }

    function unpauseMinting() external onlyOwner {
        mintingPaused = false;
        emit MintingPausedChanged(false);
    }

    // Owner-only safe mint with explicit existence tracking
    function safeMint(address to, uint256 tokenId) external onlyOwner {
        require(!mintingPaused, "minting paused");
        require(to != address(0), "mint to zero");
        require(tokenId > 0 && tokenId <= maxSupply, "invalid tokenId");
        require(_totalSupply < maxSupply, "max supply");
        require(!_minted[tokenId], "already minted");

        // mark existence before _safeMint so if _safeMint reverts whole tx reverts
        _minted[tokenId] = true;
        _totalSupply += 1;

        _safeMint(to, tokenId);
    }

    // Override burn() (ERC721Burnable defines burn as virtual) to update our counters
    function burn(uint256 tokenId) public virtual override {
        // will check ownerOrApproved inside super.burn
        super.burn(tokenId);

        // update our existence map and totalSupply
        if (_minted[tokenId]) {
            _minted[tokenId] = false;
            // Solidity >=0.8 prevents underflow; this should be safe
            _totalSupply -= 1;
        }
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _minted[tokenId];
    }
}
