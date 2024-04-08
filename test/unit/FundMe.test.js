const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe;
      let deployer;
      let mockV3Aggregator;
      const sendValue = ethers.parseEther("1");

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", () => {
        it("sets the aggregator address correctly", async () => {
          const reponse = await fundMe.getPriceFeed();
          assert.equal(reponse, mockV3Aggregator.target);
        });
      });

      describe("fund", () => {
        it("Fails if you dont send enough ETH", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });

        it("Update amount funded data structure", async () => {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getAddressToAmountFunded(deployer);

          assert.equal(response.toString(), sendValue.toString());
        });

        it("Add funder to getFunders array", async () => {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunders(0);

          assert.equal(funder, deployer);
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from single funder", async () => {
          // arrange
          const startingFundmeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundmeBalance = await ethers.provider.getBalance(
            fundMe.target
          );

          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingFundmeBalance, 0);
          assert.equal(
            (startingFundmeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );
        });

        it("Allows us to withdraw with multiple getFunders", async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundmeBalance = await ethers.provider.getBalance(
            fundMe.target
          );

          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingFundmeBalance, 0);
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );

          // check if getFunders array is reset
          expect(fundMe.getFunders()).to.be.reverted;

          // check if all addresses in getAddressToAmountFunded are being reset to zero
          for (let i = 0; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });

        it("Only allows owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedCntract = await fundMe.connect(attacker);
          expect(attackerConnectedCntract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
      });

      describe("Cheaper withdraw.....", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from single funder", async () => {
          // arrange
          const startingFundmeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // act
          const transactionResponse = await fundMe.cheaperWithdrawal();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundmeBalance = await ethers.provider.getBalance(
            fundMe.target
          );

          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingFundmeBalance, 0);
          assert.equal(
            (startingFundmeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );
        });

        it("Allows us to withdraw with multiple getFunders", async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.cheaperWithdrawal();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, gasPrice } = transactionReceipt;
          const gasCost = gasUsed * gasPrice;

          const endingFundmeBalance = await ethers.provider.getBalance(
            fundMe.target
          );

          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingFundmeBalance, 0);
          assert.equal(
            (startingFundMeBalance + startingDeployerBalance).toString(),
            (endingDeployerBalance + gasCost).toString()
          );

          // check if getFunders array is reset
          expect(fundMe.getFunders()).to.be.reverted;

          // check if all addresses in getAddressToAmountFunded are being reset to zero
          for (let i = 0; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
      });
    });

// run one test "yarn hardhat test --grep "Add funder""

// fund avg - 96326
// withdraw avg - 56976
