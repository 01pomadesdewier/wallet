// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract SanicNFT is ERC1155, Ownable {
    struct Genome { // EVM should pack uint8s together
        uint8 backgroundColor;
        uint8 backgroundEffect;
        uint8 wings;
        uint8 skinColor;
        uint8 skinPattern;
        uint8 body;
        uint8 mouth;
        uint8 eyes;
        uint8 hat;
        uint8 pet;
        uint8 accessory;
        uint8 border;
        bool exists;
    }
    mapping(uint256 => Genome) private _tokenGenome;  // genome for each token

    uint16 public constant MAX_TOKENS = 5000;

    constructor() ERC1155("https://my-game-api.io/{id}.json"){
        _mint(msg.sender, 0, MAX_TOKENS, ""); // parent token
        _tokenGenome[0] = Genome(1,1,1,1,1,1,1,1,1,1,1,1,true);
    }

    function mintWithRandom(address to, uint256 tokenId, uint256 amount) public onlyOwner {
        require(_tokenGenome[tokenId].exists == false, "token id already exists");
        _tokenGenome[tokenId].exists = true;
        _generateGenome(tokenId);
        _mint(to, tokenId, amount, "");
    }


    function _generateGenome(uint256 tokenId) private {
        uint8[12] memory parameters = [60, 60, 10, 40, 10, 100, 50, 60, 100, 10, 25, 30];
        for(uint16 i = 0; i < parameters.length; i++) {
            // https://ethereum.stackexchange.com/questions/85004/generating-random-number-in-solidity-without-chainlink
            uint randomGenomeVal = uint(keccak256(abi.encodePacked(tokenId, parameters[i]))) % parameters[i];
            parameters[i] = uint8(randomGenomeVal);
        }
        _tokenGenome[tokenId] = Genome(parameters[0],
            parameters[1],
            parameters[2],
            parameters[3],
            parameters[4],
            parameters[5],
            parameters[6],
            parameters[7],
            parameters[8],
            parameters[9],
            parameters[10],
            parameters[11],
            true
        );
    }

    function decodeGenome(uint256 tokenId) public view returns(string memory) {
        require(tokenId < MAX_TOKENS + 1, "token id out of range");
        require(_tokenGenome[tokenId].exists == true, "token does not exist");
        Genome storage _genome = _tokenGenome[tokenId];
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(abi.encodePacked(
            '[',
                Strings.toString(_genome.backgroundColor),',',
                Strings.toString(_genome.backgroundEffect),',',
                Strings.toString(_genome.wings),',',
                Strings.toString(_genome.skinColor),',',
                Strings.toString(_genome.skinPattern),',',
                Strings.toString(_genome.body),',',
                Strings.toString(_genome.mouth),',',
                Strings.toString(_genome.eyes),',',
                Strings.toString(_genome.hat),',',
                Strings.toString(_genome.pet),',',
                Strings.toString(_genome.accessory),',',
                Strings.toString(_genome.border),
            ']'
            )
        )));
    }
}