// `grantMinterRole`, `hasMinterRole`のテスト
// NFTを一枚以上保有しているアドレスに権限を付与した場合

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

  let maxBatchSize = await nftContract.getMaxBatchSize();
  console.log("MaxBatchSize is :", maxBatchSize.toString());

  addr1_balance = await nftContract.myBalanceOf(addr1.address);
  console.log("The balanceOf ", addr1.address.toString(),  " : ", addr1_balance.toString());
  addr2_balance = await nftContract.myBalanceOf(addr2.address);
  console.log("The balanceOf ", addr2.address.toString(),  " : ", addr2_balance.toString());

  isMinter0 = await nftContract.hasMinterRole(owner.address);
  console.log("ADDRESS ", owner.address, " is the MINTER or not : ", isMinter0);
  isMinter1 = await nftContract.hasMinterRole(addr1.address);
  console.log("ADDRESS ", addr1.address, " is the MINTER or not : ", isMinter1);

  txn = await nftContract.mintAndTransfer(
    "12347",
    "My MyNFT - Test",
    [addr1.address.toString()],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
    ["https://bafybeicbpeabzshnvxssrzyzup2vzhn6wtawksbnozq6q5avdfbi4vn6e4.ipfs.w3s.link/output1-15.png"],
  );
  console.log("The length of toAddress :", )
  await txn.wait();
  
  console.log("Successed in Mint")

  addr1_balance = await nftContract.myBalanceOf(addr1.address);
  console.log("The balanceOf ", addr1.address.toString(),  " : ", addr1_balance.toString());
  addr2_balance = await nftContract.myBalanceOf(addr2.address);
  console.log("The balanceOf ", addr2.address.toString(),  " : ", addr2_balance.toString());



  giveMinter0 = await nftContract.grantMinterRole(addr1.address);
  console.log("Success in grantMinterRole to ", addr1.address)

  // isMinter0 = await nftContract.onlyMinter();
  // isMinter0 = await nftContract.hasRole(MINTER_ROLE, addr1.address);
  isMinter0 = await nftContract.hasMinterRole(owner.address);
  console.log("ADDRESS ", owner.address, " is the MINTER or not : ", isMinter0);
  isMinter1 = await nftContract.hasMinterRole(addr1.address);
  console.log("ADDRESS ", addr1.address, " is the MINTER or not : ", isMinter1);
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