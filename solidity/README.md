# Overview
Explanation for the design process behind Sanic NFT.

### Assumptions
1. 5000 NFTs will be minted on chain
2. Our collection size is static (e.g no more NFTs will be created)
3. Attributes set will remain constant

### Pre-requisites
1. Ganache and Truffle are installed (see https://trufflesuite.com/ganache/)

### Testing
1. Run `ganache-cli -p 8545`
2. `truffle test`

### Thought Process
1. ERC1155 is considered to be gas-efficient token standard. You can query balance and mint tokens in batches significantly reducing the gas costs.
2. I have decided to store the genome representation in `Struct` over `uint[]` and `mapping`. Solidity EVM is smart enough to package multiple `uint8` values together reducing the gas costs. Also, my experiments showed that the gas savings are insignificant (~20000 wei) and the readability is improved a lot.
3. `decodeGenome` function is `view` meaning no gas costs will be incurred when reading (unless within the contract itself).
4. There is a `mintWithRandom` function that `mints` a single token with pseudo-random and deterministic values. It is not possible to product random values in deterministic EVM but ChainLink VRF provides this functionality for Link tokens.
