

import { ethers } from "hardhat"
import { expect } from "chai"
import { TokenVesting } from "../typechain/TokenVesting"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Erc20Mock } from "../typechain/Erc20Mock"
import { BigNumber, utils } from "ethers";
import { ContractReceipt, ContractTransaction } from "ethers"

const IERC20 = require("../artifacts/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol/IERC20.json")
describe("Vesting contract test", () => {
    let owner, benificiary, user1: SignerWithAddress
    let tv: TokenVesting;
    let token : Erc20Mock
    let tx: ContractTransaction
    let txr: ContractReceipt

    function delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }    

    before("init signers", async () => {
        [owner, benificiary, user1] = await ethers.getSigners()
    })
    
    beforeEach("deploy mockToken", async () => {
        const Erc20Mock = await ethers.getContractFactory("ERC20Mock")
        token = await Erc20Mock.connect(owner).deploy("MockToken", "MT") as Erc20Mock
        await token.deployed()
        await token.connect(owner).mint()
    })
    
    beforeEach("deploy vesting contract", async () => {
        const TokenVesting = await ethers.getContractFactory("TokenVesting", owner)
        let seconds = new Date().getTime() / 1000; // Unix timestamp in seconds
        tv = await TokenVesting.deploy(benificiary.address, seconds.toFixed(), 15, 2, token.address) as TokenVesting
        await tv.deployed()

        token.approve(owner.address, utils.parseEther('10'))
        token.transferFrom(owner.address, tv.address, utils.parseEther('10'))
    })

    it("test-vesting no token avaliable", async () => {
        await expect(tv.release()).to.be.revertedWith("TokenVesting: no tokens are due")
    })

    it("test-vesting get token for period", async () => {
        await tv.release()
        expect(await (await token.balanceOf(benificiary.address)).toString()).to.be.eq(utils.parseEther('5'))
        await delay(15000)
        await tv.release()
        expect(await (await token.balanceOf(benificiary.address)).toString()).to.be.eq(utils.parseEther('10'))
    })

    it("test-vesting get all tokens", async () => {
        await delay(10000)
        await tv.release()
        expect(await (await token.balanceOf(benificiary.address)).toString()).to.be.eq(utils.parseEther('10'))
    })
    
    it("test-vessting event emitted", async () => {
        tx = await tv.release()
        txr = await tx.wait()
        
        const expectedEventName = tv.interface.events["TokensReleased(uint256)"].name
        const actualEventName = txr.events[1].event
       
        expect(actualEventName).to.be.equal(expectedEventName);
        expect(owner.address).to.be.equal(txr.from)
    })
})
