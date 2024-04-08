// function deployFunc() {
//   console.log("Hi!");
// }
// module.exports.default = deployFunc;

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //   const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

  let ethUsdPriceFeedAddress;

  //   When going for hardhat or localhost we go for a mock
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("------------------------------------------------------------");

  if (!developmentChains.includes(network.name)) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ["all", "fundme "];
