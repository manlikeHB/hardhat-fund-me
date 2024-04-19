# Hardhat-Fund-Me

This smart contract facilitates funding of a contract with a minimum of $50 worth of ETH and also the withdrawal of all the funds to only the deployer of the contract.

## Prerequisites

- Node.js
- Yarn (package manager)
- Hardhat (development environment)

## Installation

Clone this repository:

```Bash
git clone https://github.com/manlikeHB/hardhat-fund-me.git
```

Navigate to the project directory:

```Bash
cd hardhat-fund-me
```

Install dependencies:

```Bash
yarn install
```

## Configuration

The following variables in the helper-hardhat-config.js file can be customized to tailor the contract to your specific application:

```JavaScript
const networkConfig = {
    // sepolia test network
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;
```

Provide a `.env` file with following:

```
// test network i used is sepolia
[TEST_NETWORK]_RPC_URL=RPC_URL
PRIVATE_KEY=TEST_ACCOUNT_PRIVATE_KEY
ETHERSCAN_API_KEY=ETHERSCAN_API_KEY
COINMARKETCAP_API_KEY=COINMARKETCAP_API_KEY
```

Deployment

1. Hardhat Network:

To deploy to a local Hardhat network:

```Bash
yarn hardhat deploy
```

This will compile your contract and deploy it to the localhost Hardhat network. The deployed contract address will be printed to the console.

1. Mainnet/Testnet Deployment: (Caution: Deploying to a public network involves real cryptocurrency. Ensure thorough testing and security audits before proceeding.)

Follow the instructions specific to your chosen blockchain platform (e.g., Ethereum, Polygon) for deploying contracts to a mainnet or testnet. This typically involves using a wallet or provider that supports smart contract deployment.

## Testing

1. Unit Tests:

Unit tests are located in the test directory. Run them with:

```Bash
yarn hardhat test
```

These tests verify the functionality of individual contract functions. Chai matchers are used for assertions.

## License

MIT.
