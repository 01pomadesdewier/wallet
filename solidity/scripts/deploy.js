async function main() {
  const SanicToken = await ethers.getContractFactory("SanicToken");
  const gasPrice = await SanicToken.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);
  const estimatedGas = await SanicToken.signer.estimateGas(
    SanicToken.getDeployTransaction()
  );
  console.log(`Estimated gas: ${estimatedGas}`);
  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await SanicToken.signer.getBalance();
  console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`);
  console.log( `Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`);
  if (Number(deployerBalance) < Number(deploymentPrice)) {
    throw new Error("You dont have enough balance to deploy.");
  }
// Start deployment, returning a promise that resolves to a contract object
  const myToken = await SanicToken.deploy();
  await myToken.deployed();
  console.log("Contract deployed to address:", myToken.address);
}
main().then(() => process.exit(0)).catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});