const nft = artifacts.require("sanicNFT");

contract("nft", () => {
  it("...should deploy and successfully call decode using the method's provided gas estimate", async () => {
    const nftInstance = await nft.new();

    const gasEstimate = await nftInstance.decodeGenome.estimateGas(0);

    const tx = await nftInstance.decodeGenome(0, {
      gas: gasEstimate,
    });
    assert(tx);
  });
});
// 2994394
// 3429259
// 3093200