import { Provider } from "@ethersproject/providers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**  Helper method for fetching environment variables from .env */
export function getEnvVariable(key: string, defaultValue?: string) {
  if (process.env[key]) {
    return process.env[key];
  }
  if (!defaultValue) {
    throw `${key} is not defined and no default value was provided`;
  }
  return defaultValue;
}

/**  Helper method for fetching a connection provider to the Ethereum network */
export function getProvider() {
  return ethers.getDefaultProvider(getEnvVariable("NETWORK", "rinkeby"), {
    alchemy: getEnvVariable("ALCHEMY_KEY"),
  });
}

/**  Helper method for fetching a wallet account
 * using an environment variable for the PK
 */
export function getAccount() {
  const account = getEnvVariable("PRIVATE_KEY");
  if (account) return new ethers.Wallet(account, getProvider() as Provider);
}

/**  Helper method for fetching a contract instance at a given address */
export function getContract(
  contractName: string,
  hre: HardhatRuntimeEnvironment,
) {
  const account = getAccount();
  const contractAddr = getEnvVariable("NFT_CONTRACT_ADDRESS");
  if (contractAddr)
    return getContractAt(hre, contractName, contractAddr, account);
}
