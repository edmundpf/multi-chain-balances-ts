[multi-chain-balances-ts](../README.md) / [Exports](../modules.md) / default

# Class: default

MultiChain Class

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [address](default.md#address)
- [assets](default.md#assets)
- [chainNames](default.md#chainnames)
- [chains](default.md#chains)
- [tokenNames](default.md#tokennames)
- [totalTokenValue](default.md#totaltokenvalue)
- [totalValue](default.md#totalvalue)
- [totalVaultValue](default.md#totalvaultvalue)
- [transactions](default.md#transactions)

### Methods

- [driver](default.md#driver)
- [getAllTransactions](default.md#getalltransactions)
- [getApeBoardEndpoint](default.md#getapeboardendpoint)
- [getApeBoardPositions](default.md#getapeboardpositions)
- [getBeefyApy](default.md#getbeefyapy)
- [getBeefyEndpoint](default.md#getbeefyendpoint)
- [getDebankEndpoint](default.md#getdebankendpoint)
- [getDefiTaxesEndpoint](default.md#getdefitaxesendpoint)
- [getEndpoint](default.md#getendpoint)
- [getProtocolList](default.md#getprotocollist)
- [getTokenList](default.md#gettokenlist)
- [parseApyData](default.md#parseapydata)
- [parseChainData](default.md#parsechaindata)
- [parseProtocolData](default.md#parseprotocoldata)
- [parseTokenData](default.md#parsetokendata)
- [roundNumber](default.md#roundnumber)

## Constructors

### constructor

• **new default**()

Constructor

#### Defined in

[utils/MultiChain.ts:61](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L61)

## Properties

### address

• **address**: `string`

#### Defined in

[utils/MultiChain.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L47)

___

### assets

• **assets**: `Assets` = `{}`

#### Defined in

[utils/MultiChain.ts:53](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L53)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Defined in

[utils/MultiChain.ts:54](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L54)

___

### chains

• **chains**: `Chains`

#### Defined in

[utils/MultiChain.ts:51](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L51)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Defined in

[utils/MultiChain.ts:55](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L55)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:49](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L49)

___

### totalValue

• **totalValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:48](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L48)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:50](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L50)

___

### transactions

• **transactions**: `Transactions`

#### Defined in

[utils/MultiChain.ts:52](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L52)

## Methods

### driver

▸ **driver**(): `Promise`<`void`\>

Driver

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/MultiChain.ts:69](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L69)

___

### getAllTransactions

▸ **getAllTransactions**(): `Promise`<`void`\>

Get All Transactions

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/MultiChain.ts:528](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L528)

___

### getApeBoardEndpoint

▸ `Private` **getApeBoardEndpoint**(`endpoint`): `Promise`<`any`\>

Get Ape Board Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:805](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L805)

___

### getApeBoardPositions

▸ **getApeBoardPositions**(): `Promise`<`ApeBoardPositions`\>

Get Ape Board Positions

#### Returns

`Promise`<`ApeBoardPositions`\>

#### Defined in

[utils/MultiChain.ts:477](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L477)

___

### getBeefyApy

▸ `Private` **getBeefyApy**(): `Promise`<`any`\>

Get Beefy APY

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:469](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L469)

___

### getBeefyEndpoint

▸ `Private` **getBeefyEndpoint**(`endpoint`): `Promise`<`any`\>

Get Beefy Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:797](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L797)

___

### getDebankEndpoint

▸ `Private` **getDebankEndpoint**(`endpoint`): `Promise`<`any`\>

Get Debank Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:785](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L785)

___

### getDefiTaxesEndpoint

▸ `Private` **getDefiTaxesEndpoint**(`endpoint`, `args`): `Promise`<`any`\>

Get Defi Taxes Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |
| `args` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:821](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L821)

___

### getEndpoint

▸ `Private` **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"debank"`` \| ``"beefy"`` \| ``"apeBoard"`` \| ``"defiTaxes"`` |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` \| ``"defiTaxesProcess"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:758](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L758)

___

### getProtocolList

▸ `Private` **getProtocolList**(): `Promise`<`any`\>

Get Protocol List

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:461](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L461)

___

### getTokenList

▸ `Private` **getTokenList**(): `Promise`<`any`\>

Get Token List

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:453](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L453)

___

### parseApyData

▸ `Private` **parseApyData**(`positionData`, `apyData`): `void`

Parse APY Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `positionData` | `ApeBoardPositions` |
| `apyData` | `NumDict` |

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:202](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L202)

___

### parseChainData

▸ `Private` **parseChainData**(): `void`

Parse Chain Data

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:360](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L360)

___

### parseProtocolData

▸ `Private` **parseProtocolData**(`data`): `void`

Parse Protocol Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Protocol`[] |

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:137](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L137)

___

### parseTokenData

▸ `Private` **parseTokenData**(`data`): `void`

Parse Token Data

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Token`[] |

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:92](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L92)

___

### roundNumber

▸ `Private` **roundNumber**(`val`, `places?`): `number`

Round Number

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `val` | `string` \| `number` | `undefined` |
| `places` | `number` | `2` |

#### Returns

`number`

#### Defined in

[utils/MultiChain.ts:839](https://github.com/edmundpf/multi-chain-balances-ts/blob/d918947/src/utils/MultiChain.ts#L839)
