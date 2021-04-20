# Contracts

### ALPHRToken

ALPHRToken is ERC20Burnable token
Total supply - 10,000,000 ALPHR
Decimals - 18
All tokens are minted to deplyer

### TokenVesting

TokenVesting is a smart contract for vesting that vests ALPHR tokens to beneficiary in specified periods

### TokenVault

TokenVault is a smart contract for storing ALPHR tokens that are withdrawable only by owner address

### Install and build

```
npm install -g truffle
npm init -y
npm install --save-exact openzeppelin-solidity
truffle compile
```

Compiler used 0.8.0

# Tokens distribution

### Private and seed

1,500,000 ALPHR will be sent to ALPHR tech multi sig at TGE (0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530). These tokens will be distributed by DAO Maker contract

### Team

1,916,667 ALPHR will be put in vesting contract for 23 month vesting; 0xa4a57223d07fe894440700fB14dc03A8D13455DE will be beneficiary for vesting  
83,333 ALPHR will be transferred to team multi sig at TGE (0xa4a57223d07fe894440700fB14dc03A8D13455DE).  

### Protocol Rewards

3,000,000 ALPHR will be put in vesting for 1 month. Tokens will be vested to tech multi sig (0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530)

### Liquidity Providers (LP) Rewards

1,250,000 ALPHR will be put in vesting for 1 month. Tokens will be vested to tech multi sig (0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530)
250,000 ALPHR will be sent to ALPHR tech multi sig at TGE (0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530) 

### Community development fund (CDF)

2,000,000 ALPHR will be put in vesting contract for 48 month vesting; TokenVault will be beneficiary for the vesting. Only owner could withdraw these funds from Vault. ALPHR governance contract will become owner of the community development fund

# Deployment order

1. Deploy ALPHR token contract
2. Deploy TokenVault for CDF
3. Deploy vesting contracts for Team, Protocol Rewards, LP Rewards, CDF
4. Transfer tokens to vestings and multi sigs

### Vesting parameters

- Team
beneficiary_ - 0xa4a57223d07fe894440700fB14dc03A8D13455DE (team multi sig)
start_ - 1624345200 (Tue June 22 2021 00:00:00 GMT+0000)
periodDuration_ - 2592000 (30 days)
periodsAmount_ - 23
alphr_ - ALPHR token address

- Protocol Rewards
beneficiary_ - 0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530 (tech multi sig)
start_ - 1621468800 (Thu May 20 2021 00:00:00 GMT+0000)
periodDuration_ - 86400 (1 day)
periodsAmount_ - 1
alphr_ - ALPHR token address

- LP Rewards
beneficiary_ - 0x9E631c73D7c08dfd103f572fEa45EfEe04D7f530 (tech multi sig)
start_ - 1621468800 (Thu May 20 2021 00:00:00 GMT+0000)
periodDuration_ - 86400 (1 day)
periodsAmount_ - 1
alphr_ - ALPHR token address

- CDF
beneficiary_ - Vault that will be deployed
start_ - 1624345200 (Tue June 22 2021 00:00:00 GMT+0000)
periodDuration_ - 2592000 (30 days)
periodsAmount_ - 48
alphr_ - ALPHR token address