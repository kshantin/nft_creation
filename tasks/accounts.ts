import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const [index, account] of accounts.entries()) {
    console.log(`${index}: ${await account.getAddress()}`);
  }
});
