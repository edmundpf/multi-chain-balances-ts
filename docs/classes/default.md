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

### Methods

- [driver](default.md#driver)
- [getApeBoardEndpoint](default.md#getapeboardendpoint)
- [getApeBoardPositions](default.md#getapeboardpositions)
- [getBeefyApy](default.md#getbeefyapy)
- [getBeefyEndpoint](default.md#getbeefyendpoint)
- [getDebankEndpoint](default.md#getdebankendpoint)
- [getEndpoint](default.md#getendpoint)
- [getProtocolList](default.md#getprotocollist)
- [getTokenList](default.md#gettokenlist)
- [parseApyData](default.md#parseapydata)
- [parseChainData](default.md#parsechaindata)
- [parseProtocolData](default.md#parseprotocoldata)
- [parseTokenData](default.md#parsetokendata)

## Constructors

### constructor

• **new default**()

Constructor

#### Defined in

[utils/MultiChain.ts:54](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L54)

## Properties

### address

• **address**: `string`

#### Defined in

[utils/MultiChain.ts:41](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L41)

___

### assets

• **assets**: `Assets` = `{}`

#### Defined in

[utils/MultiChain.ts:46](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L46)

___

### chainNames

• **chainNames**: keyof `Chains`[]

#### Defined in

[utils/MultiChain.ts:47](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L47)

___

### chains

• **chains**: `Chains`

#### Defined in

[utils/MultiChain.ts:45](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L45)

___

### tokenNames

• **tokenNames**: `string`[] = `[]`

#### Defined in

[utils/MultiChain.ts:48](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L48)

___

### totalTokenValue

• **totalTokenValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:43](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L43)

___

### totalValue

• **totalValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:42](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L42)

___

### totalVaultValue

• **totalVaultValue**: `number` = `0`

#### Defined in

[utils/MultiChain.ts:44](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L44)

## Methods

### driver

▸ **driver**(): `Promise`<`void`\>

Driver

#### Returns

`Promise`<`void`\>

#### Defined in

[utils/MultiChain.ts:62](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L62)

___

### getApeBoardEndpoint

▸ `Private` **getApeBoardEndpoint**(`endpoint`): `Promise`<`any`\>

Get Ape Board Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:541](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L541)

___

### getApeBoardPositions

▸ **getApeBoardPositions**(): `Promise`<`ApeBoardPositions`\>

Get Ape Board Positions

#### Returns

`Promise`<`ApeBoardPositions`\>

#### Defined in

[utils/MultiChain.ts:443](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L443)

___

### getBeefyApy

▸ `Private` **getBeefyApy**(): `Promise`<`any`\>

Get Beefy APY

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:435](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L435)

___

### getBeefyEndpoint

▸ `Private` **getBeefyEndpoint**(`endpoint`): `Promise`<`any`\>

Get Beefy Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:533](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L533)

___

### getDebankEndpoint

▸ `Private` **getDebankEndpoint**(`endpoint`): `Promise`<`any`\>

Get Debank Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:521](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L521)

___

### getEndpoint

▸ `Private` **getEndpoint**(`api`, `endpoint`, `params?`, `headers?`): `Promise`<`any`\>

Get Endpoint

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | ``"debank"`` \| ``"beefy"`` \| ``"apeBoard"`` |
| `endpoint` | ``"beefyBsc"`` \| ``"beefyPolygon"`` \| ``"tokenList"`` \| ``"protocolList"`` \| ``"beefyApy"`` |
| `params?` | `any` |
| `headers?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:494](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L494)

___

### getProtocolList

▸ `Private` **getProtocolList**(): `Promise`<`any`\>

Get Protocol List

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:427](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L427)

___

### getTokenList

▸ `Private` **getTokenList**(): `Promise`<`any`\>

Get Token List

#### Returns

`Promise`<`any`\>

#### Defined in

[utils/MultiChain.ts:419](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L419)

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

[utils/MultiChain.ts:194](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L194)

___

### parseChainData

▸ `Private` **parseChainData**(): `void`

Parse Chain Data

#### Returns

`void`

#### Defined in

[utils/MultiChain.ts:326](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L326)

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

[utils/MultiChain.ts:129](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L129)

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

[utils/MultiChain.ts:84](https://github.com/edmundpf/multi-chain-balances-ts/blob/364e45c/src/utils/MultiChain.ts#L84)
