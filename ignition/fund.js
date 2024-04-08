const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  const deployer = await getNamedAccounts().deployer;
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding contracts....");
  const transactionResponse = await fundMe.fund({
    value: ethers.parseEther("0.035"),
  });

  transactionResponse.wait(1);
  console.log("Funded!");
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
  });
