const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  const deployer = await getNamedAccounts().deployer;
  const fundMe = await ethers.getContract("FundMe", deployer);

  //   get balance
  const balance = await ethers.provider.getBalance(fundMe.target);
  console.log({ balance });

  console.log("Withdrawing...");
  const transactionResponse = await fundMe.withdraw();
  transactionResponse.wait(1);
  console.log("Withdraw successful!");

  const endBalance = await ethers.provider.getBalance(fundMe.target);
  console.log({ endBalance });
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
  });
