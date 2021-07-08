require('dotenv').config()

const ALPHRToken = artifacts.require('ALPHRToken')
const TokenVault = artifacts.require('TokenVault')
const TeamVesting = artifacts.require('TokenVesting')
const ProtocolRewardsVesting = artifacts.require('TokenVesting')
const LPRewardsVesting = artifacts.require('TokenVesting')
const CDFVesting = artifacts.require('TokenVesting')

module.exports = async function (deployer) {
  await deployer.deploy(ALPHRToken)
  await deployer.deploy(TokenVault)
  // Team Vesting
  await deployer.deploy(
    TeamVesting,
    process.env.KOVAN_BENEFICIARY || '0x793565878C643d507EC3365229Da5495c2F76A29',
    1624345200,
    2592000,
    23,
    ALPHRToken.address
  )
  // Protocol Rewards Vesting
  await deployer.deploy(
    ProtocolRewardsVesting,
    process.env.KOVAN_BENEFICIARY || '0x77E36C96166177337f54352837e7bBce6C437d44',
    1621468800,
    86400,
    1,
    ALPHRToken.address
  )
  // LP Rewards Vesting
  await deployer.deploy(
    LPRewardsVesting,
    process.env.KOVAN_BENEFICIARY || '0x77E36C96166177337f54352837e7bBce6C437d44',
    1620370800,
    86400,
    1,
    ALPHRToken.address
  )
  // CDF Vesting
  await deployer.deploy(CDFVesting, TokenVault.address, 1624345200, 2592000, 48, ALPHRToken.address)
}
