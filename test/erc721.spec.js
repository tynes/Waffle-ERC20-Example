const { use, expect } = require('chai');
const { solidity, deployContract } = require('ethereum-waffle');
const { getProvider } = require('./setup')
const ERC721 = require('../build/ERC721.json');

use(solidity);

describe('ERC721 smart contract', () => {
  let provider;
  let wallet, walletTo, address;

  before(async () => {
    provider = await getProvider()
    const wallets = provider.getWallets()
    wallet = wallets[0]
    walletTo = wallets[1];
  })

  const TO_MINT = 10;

  beforeEach(async () => {
    token = await deployContract(wallet, ERC721, [TO_MINT])
  })

  it('should mint to msg.sender', async () => {
    const balance = await token.balanceOf(wallet.address);
    const count = balance.toNumber();
    expect(count).to.equal(TO_MINT);
  });

  it('Transfer adds amount to destination account', async () => {
    await token.safeTransferFrom(wallet.address, walletTo.address, 0);

    {
      const balance = await token.balanceOf(walletTo.address);
      const count = balance.toNumber();
      expect(count).to.equal(1);
    }

    {
      const balance = await token.balanceOf(wallet.address);
      const count = balance.toNumber();
      expect(count).to.equal(TO_MINT - 1);
    }
  });
});
