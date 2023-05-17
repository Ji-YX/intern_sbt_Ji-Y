# テストの仕様書

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
`_toAddress`が一つだけの場合
- 既に実行済み、問題なし

`_toAddress`が複数ある場合
- 成功
<!-- 以下のようなエラーが出てくる。
```
Error: VM Exception while processing transaction: reverted with reason string 'newOwner's balance must be zero.'
``` -->

スマコンのOwner以外がミントする場合（既に、 NFTを保有しているアカウント）



#### 問題のある動作
NFTを一枚も保有していないアドレスが、ミントしようとした場合

存在しないアドレスへのミント

既にNFTを保有しているアドレスへのミント
<!-- - 失敗：`_credentialId`が異なれば、既に NFTを保有しているアドレスにも、mintが可能（同じアドレスは、２枚以上 NFTを保有できる） -->
- 成功（同じアドレスに２枚目以上をミントしようとすると、エラーになる。）

<!-- 場合によっては、以下のように、`transferOwnershi`関数の中でのエラーメッセージが出力され、成功することもある
```
Error: VM Exception while processing transaction: reverted with reason string 'newOwner's balance must be zero.'
``` -->

既に存在する`_credentialId`を用いてミントを行う
- 問題なし（予期通り、エラーがでる。）

`_toAddress`と、`_imaegURIs`の要素数が異なっている場合
- 問題なし（自分で設定した警告文が表示され、エラーになる）
```
Error: VM Exception while processing transaction: reverted with reason string 'The length of _toAddresses and _imageURIs are NOT same.'
```

同じアドレスに複数回ミントしようとした場合
- 失敗、毎回ミントできてしまう

`_toAddress`と、`_externals`の要素数が異なっている場合
- 問題なし（自分で設定した警告文が表示され、エラーになる）
```
Error: VM Exception while processing transaction: reverted with reason string 'The length of _toAddresses and _externalURIs are NOT same.'
```



### `transferFrom`

### `transferOwnership`
#### 正常な場合
s



### `maxBatchSize`　：バッチ処理で発行できるNFTの枚数の上限を返り値とする関数
- 問題なし

### `setBatchSize` :バッチ処理で発行できるNFTの枚数の上限を変更する関数
- 問題なし

####
Owner以外がこの関数を呼び出した場合

### `myBalanceOf`　:そのアドレスが保有しているNFTの枚数を表示
- 問題なし