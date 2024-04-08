const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe;
      let deployer;
      const sendValue = ethers.parseEther("0.03");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("It allows funding and withdrawal", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();

        const endingFundMeBalance = await ethers.provider.getBalance(
          fundMe.target
        );

        assert(endingFundMeBalance.toString(), 0);
      });
    });
