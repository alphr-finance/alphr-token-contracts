import { ethers } from "hardhat"
import { expect } from "chai"
import { TokenVault } from "../typechain/TokenVault"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {Erc20Mock} from "../typechain/Erc20Mock"
import { utils } from "ethers";

describe("Vault contract test", () => {
    let owner, user1, user2: SignerWithAddress
    let tv: TokenVault;
    let token : Erc20Mock

    before("init signers", async () => {
        [owner, user1, user2] = await ethers.getSigners()
    })

    before("deploy vault contract and create mock", async () => {
        const TokenVault = await ethers.getContractFactory("TokenVault", owner)
        tv = await TokenVault.deploy() as TokenVault
        await tv.deployed()        
        const Erc20Mock = await ethers.getContractFactory("ERC20Mock")
        token = await Erc20Mock.connect(owner).deploy("MockToken", "MT") as Erc20Mock
        await token.deployed()
        await token.connect(owner).mint()
    })
    
    it("test-vault send tokens", async () => {
        token.approve(owner.address, utils.parseEther('10'))
        token.transferFrom(owner.address, tv.address, utils.parseEther('10'))
        tv.sendTokens(token.address, user1.address, utils.parseEther('5'))
        expect(await token.balanceOf(user1.address)).to.be.eq(await token.balanceOf(tv.address))
    })
    
    it("test-vault send tokens by non owner", async () => {
        await expect(tv.connect(user2).sendTokens(token.address, user1.address, utils.parseEther('5'))).to.be.revertedWith("revert Ownable: caller is not the owner")
    })
    
    it("test-vault send ether", async () => {
        await owner.sendTransaction({to: tv.address, value: utils.parseEther('2')})
        await tv.sendEther(user2.address, utils.parseEther('1'))
        expect(await tv.getBalance()).to.eq(utils.parseEther("1"))
    })

    it("test-vault send eth tokens by non owner", async () => {
        await expect(tv.connect(user2).sendEther(user1.address, utils.parseEther('5'))).to.be.revertedWith("revert Ownable: caller is not the owner")
    })
})