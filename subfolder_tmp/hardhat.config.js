require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()

// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  // defaultNetwork: "goerli",
  // networks: {
  //   goerli: {
  //     url: "https://eth-goerli.g.alchemy.com/v2/3r1WHK6WEFFVGP2wa8UZyufAp1JEIpFW",
  //     accounts:["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"],
  //   },
  // },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_TOKEN,
      mainnet: process.env.ETHERSCAN_API_TOKEN,
      polygonMumbai: process.env.POLYGONSCAN_API_TOKEN,
      polygon: process.env.POLYGONSCAN_API_TOKEN,
    },
  },
  paths: {
    tests: "./tests/contracts",
  },
  mocha: {
    timeout: 1000 * 60 * 3, // 3min
  },
}
