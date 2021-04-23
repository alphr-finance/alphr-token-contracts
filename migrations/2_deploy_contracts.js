require("dotenv").config();

const ALPHRToken = artifacts.require("ALPHRToken");
const TokenVault = artifacts.require("TokenVault");
const TeamVesting = artifacts.require("TokenVesting");
const ProtocolRewardsVesting = artifacts.require("TokenVesting");
const LPRewardsVesting = artifacts.require("TokenVesting");
const CDFVesting = artifacts.require("TokenVesting");

module.exports = async function (deployer) {
  await deployer.deploy(ALPHRToken);
  await deployer.deploy(TokenVault);
  // Team Vesting
  await deployer.deploy(
    TeamVesting,
    "0xa4a57223d07fe894440700fB14dc03A8D13455DE",
    1624345200,
    2592000,
    23,
    ALPHRToken.address
  );
  // Protocol Rewards Vesting
  await deployer.deploy(
    ProtocolRewardsVesting,
    "0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530",
    1621468800,
    86400,
    1,
    ALPHRToken.address
  );
  // LP Rewards Vesting
  await deployer.deploy(
    LPRewardsVesting,
    "0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530",
    1621468800,
    86400,
    1,
    ALPHRToken.address
  );
  // CDF Vesting
  await deployer.deploy(
    CDFVesting,
    TokenVault.address,
    1624345200,
    2592000,
    48,
    ALPHRToken.address
  );
};
