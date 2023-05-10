const main = async () => {
  // コントラクトがコンパイルします
  // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
  [owner, addr1, addr2] = await hre.ethers.getSigners(); //秘密鍵の作成
  const nftContractFactory = await hre.ethers.getContractFactory("SharedNFT", owner);
  // Hardhat がローカルの Ethereum ネットワークを作成します。
  const nftContract = await nftContractFactory.deploy("My NFT", "NFT", 1);
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // let getMaxBatchSize = nftContract.getMaxBatchSize();
  let maxBatchSize = await nftContract.getMaxBatchSize();
  // const maxBatchSize =  await getMaxBatchSize.wait();
  console.log("MaxBatchSize is :", maxBatchSize.toString());

  await nftContract.setMaxBatchSize(10);
  console.log("MaxBatchsize Changed")

  maxBatchSize = await nftContract.getMaxBatchSize();
  // const maxBatchSize =  await getMaxBatchSize.wait();
  console.log("MaxBatchSize is :", maxBatchSize.toString());


  let txn = await nftContract.mintAndTransfer(
    "12345",
    "My MyNFT - Test",
    [addr1.address.toString()],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
  );
  // console.log("Successed in mitAndTranser (BEFORE await)")
  await txn.wait();

  

  txn = await nftContract.mintAndTransfer(
    "12346",
    "My MyNFT - Test",
    [addr1.address.toString()],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
  );
  await txn.wait();

  txn = await nftContract.mintAndTransfer(
    "12347",
    "My MyNFT - Test",
    [addr1.address.toString(), addr2.address.toString()],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png", "https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png", "https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
  );
  await txn.wait();
  // console.log("Successed in Mint")

  //grantmintrole

  //transferFrom
  // let transferFrom = await nftContract.transferFrom(
  //   addr1.address.toString(),
  //   addr2.address.toString(),
  //   1
  // )
  // await transferFrom.wait();

  let transferOwnership = await nftContract.transferOwnership(
    addr2.address.toString(),
  );

  await transferOwnership.wait();
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