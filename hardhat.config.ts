import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "ethereum-waffle"

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
export default config;