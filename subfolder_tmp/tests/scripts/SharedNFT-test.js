const main = async() => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  [owner, addr1, addr2, addr3] = await hre.ethers.getSigners(); //秘密鍵の作成
  const nftContractFactory = await hre.ethers.getContractFactory("SharedNFT", owner);
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy("My NFT", "NFT", 1);
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log("SUCCESS: Contract deployed to:", nftContract.address);

  console.log("\nTest of getMaxBatchSize");
  let maxBatchSize = await nftContract.getMaxBatchSize();
  console.log("SUCCESS: MaxBatchSize is :", maxBatchSize.toString());

  console.log("\n\nTest of setMaxbatchSize");
  console.log("\nTEST1 : expected case");
  let maxBatchSize2 = await nftContract.getMaxBatchSize();
  // const maxBatchSize =  await getMaxBatchSize.wait();
  console.log("MaxBatchSize is :", maxBatchSize2.toString());

  await nftContract.setMaxBatchSize(10);
  // console.log("MaxBatchsize Changed");

  maxBatchSize = await nftContract.getMaxBatchSize();
  // const maxBatchSize =  await getMaxBatchSize.wait();
  console.log("MaxBatchSize is :", maxBatchSize.toString(), "<- if this is 10, it is SUCCESS");

  // console.log("\nTEST2 : unexpected case : minus number as argument");

};

const main2 = async() => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  [owner, addr1, addr2, addr3] = await hre.ethers.getSigners(); //秘密鍵の作成
  const nftContractFactory = await hre.ethers.getContractFactory("SharedNFT", owner);
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy("My NFT", "NFT", 1);
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  // console.log("SUCCESS: Contract deployed to:", nftContract.address);

  // console.log("\n\nTest of setMaxbatchSize");
  console.log("\nTEST2 : unexpected case : minus number as argument");
  let maxBatchSize2 = await nftContract.getMaxBatchSize();
  // const maxBatchSize =  await getMaxBatchSize.wait();
  console.log("MaxBatchSize is :", maxBatchSize2.toString());

  await nftContract.setMaxBatchSize(-1);
  // console.log("MaxBatchsize Changed");

  maxBatchSize = await nftContract.getMaxBatchSize();
  // const maxBatchSize =  await getMaxBatchSize.wait();
  // console.log("MaxBatchSize is :", maxBatchSize.toString(), "<- if this is 10, it is SUCCESS");

  console.log("\nIf Error msg printed, then TEST2 SUCCESS")

};

const main3 = async() => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  [owner, addr1, addr2, addr3] = await hre.ethers.getSigners(); //秘密鍵の作成
  const nftContractFactory = await hre.ethers.getContractFactory("SharedNFT", owner);
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy("My NFT", "NFT", 1);
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  // console.log("SUCCESS: Contract deployed to:", nftContract.address);

  addr1_balance = await nftContract.myBalanceOf(addr1.address);
  console.log("The balanceOf ", addr1.address.toString(),  " : ", addr1_balance.toString());
  addr2_balance = await nftContract.myBalanceOf(addr2.address);
  console.log("The balanceOf ", addr2.address.toString(),  " : ", addr2_balance.toString());

}


function stopError() {
  return true;
}


// エラー処理を行っています。
const runMain = async () => {
// function runMain() {
  try {
    await main();
    await main3();
    await main2();
    process.exit(0);
  } catch (error) {
    // console.log(error);
    // process.exit(1);
    console.log("Error msg\n")
    console.log(error);
    // process.exit(1);
    console.log("\nEnd of error message")
    // console.log(error.from);
    // console.log(toString(error.from));

    // await main3();
    // await main2();
    // if (error.from === 'main') {
    //   await main();
    // } else if (error.from === 'main2') {
    //   await main2();
    // }
  }
};

// const runMain2= async () => {
//   try {
//     await main2();
//     process.exit(0);
//   } catch (error) {
    // console.log("Error msg\n")
    // console.log(error);
    // // process.exit(1);
    // console.log("\nEnd of error message")
//   }
// };
// runMain2();
runMain();
