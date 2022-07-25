import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import dotenv from "dotenv";
import "hardhat-gas-reporter";
import "hardhat-packager";
import { HardhatUserConfig } from "hardhat/config";
import isCI from "is-ci";
import "solidity-coverage";
import "./tasks";

dotenv.config();
const {
  COIN_MARKET_CAP_API_KEY = "d25b5576-a4ee-41be-bb2b-aca2ba3ae5d8",
  ETHERSCAN_API_KEY,
  INFURA_PROJECT_ID = "84842078b09946638c03157f83405213",
  MNEMONIC = "overn merry manual oil detail fit pair boat possible pitch icon donkey",
  REPORT_GAS = "false",
  SOLIDITY_VERSION = "0.8.11",
} = process.env;

if (!MNEMONIC) {
  console.error(
    "Please set your MNEMONIC in environment variable or .env file",
  );
  process.exit(1);
}
const accounts = {
  count: 10,
  mnemonic: MNEMONIC,
};

const config: HardhatUserConfig = {
  gasReporter: {
    coinmarketcap: COIN_MARKET_CAP_API_KEY,
    currency: "USD",
    enabled: REPORT_GAS === "true" ? true : false,
    src: "./contracts/",
  },
  solidity: {
    version: SOLIDITY_VERSION,
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },

      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  networks: {
    hardhat: {
      accounts,
    },
    eth: {
      url: "https://cloudflare-eth.com",
      chainId: 1,
      accounts,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 3,
      accounts,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 4,
      accounts,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 5,
      accounts,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 42,
      accounts,
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      chainId: 56,
      accounts,
    },
    "bsc-test": {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts,
    },
    "avalanche-test": {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts,
    },
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts,
    },
    "polygon-test": {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts,
    },
    fantom: {
      url: "https://rpc.ftm.tools",
      chainId: 250,
      accounts,
    },
    "fantom-test": {
      url: "https://rpc.testnet.fantom.network",
      chainId: 4002,
      accounts,
    },
  },
  paths: {
    tests: "./tests/",
  },
  mocha: {
    reporter: isCI ? "mocha-junit-reporter" : "spec",
    reporterOptions: {
      jenkinsMode: true,
    },
  },
  typechain: {
    target: "ethers-v5",
    outDir: "./src/types/",
  },
  packager: {
    contracts: ["Greeter"],
    includeFactories: true,
  },
};

export default config;
