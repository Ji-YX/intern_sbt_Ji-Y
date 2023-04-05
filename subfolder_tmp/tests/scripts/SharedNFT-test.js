const main = async () => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  const nftContractFactory = await hre.ethers.getContractFactory("SharedNFT");
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy("My NFT", "NFT", 1);
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let txn = await nftContract.mintAndTransfer(
    "12345",
    "My MyNFT - Test",
    [0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199, 0xdD2FD4581271e230360230F9337D5c0430Bf44C0],
    [],
    [],
    accounts[0]
  );
  await txn.wait();

  // txn = await nftContract.mintAndTransfer();
  // await txn.wait();
};
// エラー処理を行っています。
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();