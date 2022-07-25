/* import "@nomiclabs/hardhat-ethers";
import * as swc from "@swc/core";
import { Config } from "@swc/core";
import { BundleOptions } from "@swc/core/spack";
import { readJSONSync } from "fs-extra";

const defaultSWCOptions: Config = readJSONSync("./.swcrc");
const defaultSWCPackOptions: BundleOptions = {
  mode: "production",
  entry: {
    bundle: "./src/index.ts",
  },
  output: {
    path: "./dist/",
    name: "index.js",
  },
  module: {},
};

async function main(): Promise<void> {
  console.debug(
    await swc.bundle([
      {
        ...defaultSWCPackOptions,
        options: {
          ...defaultSWCOptions,
        },
      },
      {
        ...defaultSWCPackOptions,
        options: {
          ...defaultSWCOptions,
        },
      },
    ]),
  );
} */

import { subtask, task } from "hardhat/config";

enum Module {
  CommonJS,
  ESM,
  UMD,
}

subtask("bundle-package:bundle", async (args, hre) => {});

task(
  "bundle-package",
  "Bundles TypeChain bindings for registry deployment",
  async (_args, { run }) => {
    await run("prepare-package");
  },
);
