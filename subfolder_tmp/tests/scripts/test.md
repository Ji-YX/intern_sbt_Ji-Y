# テストの仕様書

## テストの実行方法
```
npx hardhat run SharedNFT-test**.js
```
`**`に、対応するテスト用のjsコードの番号を入れる。

## テストするべき関数

｀contracts/Shared NFT.sol`にある関数
- `mintAndTransfer` : important
- `transferFrom`
- `updateNFT`
- `getMaxBatchSize`
- `setMaxBatchSize`
- `ownCredential`
- `transferOwnership` : important
- `getMintedBy`
- `_beforeTokenTransfers`
- `generateTokenURI`
- `myBalanceOf` - for debugging

  

### `mintAndTransfer`

```
function mintAndTransfer(
    string memory _credentialId,
    string memory _description,
    address[] memory _toAddresses,
    string[] memory _imageURIs,
    string[] memory _externalURIs
) 
```

#### 正常に動く場合
- `_toAddress`が一つだけの場合 `SharedNFT-test1.js`  
-> 既に実行済み、問題なし

- `_toAddress`が複数ある場合 `SharedNFT-test2.js`  
-> 成功
<!-- 以下のようなエラーが出てくる。
```
Error: VM Exception while processing transaction: reverted with reason string 'newOwner's balance must be zero.'
``` -->

#### スマコンのOwner以外がミントする場合（既に、 NFTを保有しているアカウント）
-> `SharedNFT-test7.js`


#### 問題のある動作
- NFTを一枚も保有していないアドレスが、ミントしようとした場合

- 存在しないアドレスへのミント

- 既にNFTを保有しているアドレスへのミント `SharedNFT-test3.js`  
-> 成功（同じアドレスに２枚目以上をミントしようとすると、エラーになる。）

<!-- - 失敗：`_credentialId`が異なれば、既に NFTを保有しているアドレスにも、mintが可能（同じアドレスは、２枚以上 NFTを保有できる） -->
```
Error: VM Exception while processing transaction: reverted with reason string 'The balanceOf some addresses is NOT zero.'
```

<!-- 場合によっては、以下のように、`transferOwnershi`関数の中でのエラーメッセージが出力され、成功することもある
```
Error: VM Exception while processing transaction: reverted with reason string 'newOwner's balance must be zero.'
``` -->

- 既に存在する`_credentialId`を用いてミントを行う  `SharedNFT-test4.js`  
-> 正常通り動作する  
コード上は、うまくいかない場合もあるため、このようなケースを実装したい。
<!-- -> 問題なし（予期通り、エラーがでる。） -->

- `_toAddress`と、`_imaegURIs`の要素数が異なっている場合   `Shared-NFT-test5.js`  
-> 問題なし（自分で設定した警告文が表示され、エラーになる）
```
Error: VM Exception while processing transaction: reverted with reason string 'The length of _toAddresses and _imageURIs are NOT same.'
```

- `_toAddress`と、`_externals`の要素数が異なっている場合  `SharedNFT-test6.js`  
-> 問題なし（自分で設定した警告文が表示され、エラーになる）  
```
Error: VM Exception while processing transaction: reverted with reason string 'The length of _toAddresses and _externalURIs are NOT same.'
```

- `owner`自身にミントしようとした場合  (`SharedNFT-test11.js`)  
予想通り、エラーになり、owner自身にミントすることはできない
```
Error: VM Exception while processing transaction: reverted with reason string '_toAddresses must NOT be included OWNER.'
```


- 同じアドレスに複数回ミントしようとした場合  
-> 失敗、毎回ミントできてしまう





### `transferFrom`

### `transferOwnership`
#### 正常な場合



### `maxBatchSize`　
バッチ処理で発行できるNFTの枚数の上限を返り値とする関数  
-> 問題なし

### `setBatchSize` :バッチ処理で発行できるNFTの枚数の上限を変更する関数
- 問題なし

####
Owner以外がこの関数を呼び出した場合

### `myBalanceOf`　:そのアドレスが保有しているNFTの枚数を表示
- 問題なし



### `hasMinterRole` (`SharedNFT-test8.js`)
-> 成功

### `grantMinterRole` 
- NFTを一枚以上保有しているアドレスに権限を付与した場合　　(`SharedNFT-test8.js`)  
成功  
元々`hasMinterRole`が`false`だったアドレスが、`grantMinterRole`後に、`true`になっている。
- NFTを一枚も保有していないアドレスに権限を付与した場合  (`SharedNFT-test9.js`)  
正常に動作 (以下のようなエラーが出る)
```
Error: VM Exception while processing transaction: reverted with reason string 'Only accounts with at least one NFT can be granted MINTER_ROLE'
```
- `owner`に`grantMinterRole`を適用した場合 (`owner`のNFT保有枚数0枚) 
元々`owner`は、`MINTER`であるので、この関数を適用する必要はないが、  
`owner`のNFT保有枚数が0枚の状態で、`grantMinterRole`を適用した場合、以下のようなエラーが発生：
```
Error: VM Exception while processing transaction: reverted with reason string 'Only accounts with at least one NFT can be granted MINTER_ROLE'
```
- `owner`に`grantMinterRole`を適用した場合 (`owner`のNFT保有枚数が1枚以上)  
そもそも、`mintAndTransfer`で、オーナー自身にミントすることができないため、 「`owner`のNFT保有枚数が1枚以上」の状態にはならない。
- すでにMINTERになっているアドレスに、`grantMinterRole`を適用した場合