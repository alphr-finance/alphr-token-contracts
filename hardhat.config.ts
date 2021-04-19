import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";

import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";

require('hardhat-log-remover')
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.1',
    settings: {
      outputSelection: {
        "*": {
            "*": ["storageLayout"],
        },
      },
    }
  },
  mocha: {
    bail: true
  }
};


task("uni:balance", "balance of UNI token")
  .addParam("address")
  .setAction(async (args, hre) => {
    await hre.ethers.getContractAt("IERC20", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")
      .then(async uni => console.log("%s has %d UNI tokens on balance",
        args.address,
        await uni.balanceOf(args.address)))
  })
export default config;